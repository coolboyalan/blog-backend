const blog = require("../models/blogModel");
const author = require("../models/authorModel");
const isValid = require("../validator/blogValidator");

const createBlog = async (req, res) => {
  try {
    let error = isValid.createBlog(req.body);

    if (error) {
      return res
        .status(400)
        .send({ status: false, message: "please fix the error", error });
    }

    const data = {
      title: req.body.title,
      body: req.body.body,
      authorId: req.body.authorId,
      category: req.body.category,
    };

    if (req.body.tags) {
      if (!Array.isArray(req.body.tags)) {
        return res
          .status(400)
          .send({ status: false, message: "tags should be an array" });
      }
      if (req.body.tags.length < 1) {
        return res
          .status(400)
          .send({ status: false, message: "tags should have atleast one tag" });
      }
      data.tags = req.body.tags;
    }
    if (req.body.subCategory) {
      if (!Array.isArray(req.body.subCategory)) {
        return res
          .status(400)
          .send({ status: false, message: "subCategory should be an array" });
      }
      if (req.body.subCategory.length < 1) {
        return res.status(400).send({
          status: false,
          message: "subCategory should have atleast one element",
        });
      }
      data.subCategory = req.body.subCategory;
    }
    if (req.user !== req.body.authorId) {
      return res
        .status(403)
        .send({
          status: false,
          message: "you are not authorized to create blog for this author",
        });
    }
    const authorExists = await author.findById(req.body.authorId);

    if (!authorExists) {
      return res
        .status(400)
        .send({ status: false, message: "author doesn't exist" });
    }

    const blogData = await blog.create(data);
    return res
      .status(201)
      .send({ status: true, message: "blog created", blogData });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: false, message: "Internal server error" });
  }
};

const getBlog = async (req, res) => {
  try {
    const query = Object.keys(req.query);
    if (query.length === 0) {
      const blogData = await blog.find({ isPublished: true, isDeleted: false });
      return res
        .status(200)
        .send({ status: true, message: "blogs fetched", blogData });
    }
    let error = isValid.getBlogsByQuery(req.query);
    if (error) {
      return res
        .status(400)
        .send({ status: false, message: "please fix the error", error });
    }
    req.query.isPublished = true;
    req.query.isDeleted = false;
    const blogData = await blog.find(req.query);
    return res
      .status(200)
      .send({ status: true, message: "blogs fetched", blogData });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: false, message: "Internal server error" });
  }
};

const updateBlog = async (req, res) => {
  try {
    const isPublished = req.isPublished;
    let error = isValid.updateBlog(req.body);

    if (error) {
      return res
        .status(400)
        .send({ status: false, message: "please fix the error", error });
    }

    if (!isPublished) {
      req.body.isPublished = true;
      req.body.publishedAt = Date.now();
    }
    const blogData = await blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    return res
      .status(200)
      .send({ status: true, message: "blog updated", blogData });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: false, message: "Internal server error" });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blogData = await blog.findByIdAndUpdate(req.params.id, {
      isDeleted: true,
    });
    if (blogData.isDeleted) {
      return res.status(404).send({
        status: false,
        message: "No blog found with this id",
      });
    }
    return res.status(200).send({ status: true, message: "blog deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: false, message: "Internal server error" });
  }
};
module.exports = {
  createBlog,
  getBlog,
  updateBlog,
  deleteBlog,
};

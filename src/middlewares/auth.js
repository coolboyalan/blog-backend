const jwt = require("jsonwebtoken");
const blog = require("../models/blogModel.js");

const authentication = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res
      .status(401)
      .send({ status: false, message: "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (err) {
    res.status(401).send({ status: false, message: "Token is not valid" });
  }
};

const authorization = async (req, res, next) => {
  try {
    const existing = await blog.findById(req.params.id);
    if (!existing) {
      return res.status(404).send({ status: false, message: "blog not found" });
    }
    if (existing.isDeleted) {
      return res.status(404).send({ status: false, message: "blog not found" });
    }
    if (existing.authorId.toString() !== req.user) {
      return res
        .status(403)
        .send({ status: false, message: "Not authorized to access this blog" });
    }
    if (existing.isPublished) {
      req.isPublished = true;
    }
    next();
  } catch (err) {
    res.status(500).send({ status: false, message: "Internal server error" });
  }
};

module.exports = {
  authentication,
  authorization,
};

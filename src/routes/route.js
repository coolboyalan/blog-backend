const express = require("express");
const author = require("../controllers/authorController.js");
const blog = require("../controllers/blogController.js");
const mid = require("../middlewares/auth.js");
const router = express.Router();

// Author routes
router.post("/author", author.signUp); // API to create a new author
router.post("/author/login", author.login); // API to login an author

// Blog routes
router.post("/blogs",mid.authentication, blog.createBlog); // API to create a new blog
router.get("/blogs",mid.authentication ,blog.getBlog); // API to get all blogs with or without query
router.put("/blogs/:id",mid.authentication,mid.authorization, blog.updateBlog); // API to update a blog by id
router.delete("/blogs/:id",mid.authentication,mid.authorization, blog.deleteBlog); // API to delete a blog by id

module.exports = router;

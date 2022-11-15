const { Schema, model } = require("mongoose");
const id = Schema.Types.ObjectId;
const Blog = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    authorId: {
      type: id,
      ref: "author",
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
    },
    category: {
      type: [String],
      required: true,
    },
    subCategory: {
      type: [String],
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = model("blog", Blog);

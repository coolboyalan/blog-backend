const { isValidObjectId } = require("mongoose");

let blogDetails = ["title", "body", "authorId", "category"];
const fields = new Set(blogDetails);
fields.add("tags");
fields.add("subCategory");

const createBlog = (body) => {
  for (let key of blogDetails) {
    if (!(key in body)) {
      error = `${key} is missing in request body`;
      return error;
    }
    if (typeof body[key] !== "string") {
      error = `${key} should be a string`;
      return error;
    }

    body[key] = body[key].trim();

    if (key === "title") {
      if (body[key].length < 3) {
        error = `${key} is too short`;
        return error;
      }
      continue;
    }
    if (key === "body") {
      if (body[key].length < 10) {
        error = `${key} is too short`;
        return error;
      }
      continue;
    }
    if (key === "category") {
      if (body[key].length < 1) {
        error = `${key} is too short`;
        return error;
      }
      continue;
    }
    if (key === "authorId") {
      if (!isValidObjectId(body[key])) {
        error = `${key} is not a valid id`;
        return error;
      }
      continue;
    }
  }
  if (!body.update) {
    // if update is true, then we are doing check to update the blog
    for (let key in body) {
      if (!fields.has(key)) {
        delete body[key];
      }
    }
  }
};

let filters = ["subCategory", "tags", "authorId", "category"];
const getBlogsByQuery = (query) => {
  let error = null;

  for (let key in query) {
    if (!filters.includes(key)) {
      delete query[key];
    }
  }

  if (Object.keys(query).length === 0) {
    error = "No valid fields in request query";
    return error;
  }
  if ("authorId" in query) {
    if (!isValidObjectId(query.authorId)) {
      error = `authorId is not a valid id`;
      return error;
    }
  }
  if ("category" in query) {
    query.category = query.category.trim();
    if (query.category.length < 1) {
      error = "category in query params isn't valid";
      return error;
    }
  }
  filters = ["tags", "subCategory"];

  for (let key of filters) {
    if (!(key in query)) {
      continue;
    }

    if (!Array.isArray(query[key])) {
      query[key] = query[key].trim();
      if (!query[key].length) {
        error = `${key} filter can't be empty`;
        return error;
      }
      query[key] = [query[key]];
      continue;
    }
    if (!query[key].length) {
      error = `${key} array can't be empty`;
      return error;
    }
    query[key].some((ele, index) => {
      query[key][index] = ele.trim();
      if (!ele.trim().length) {
        error = `${key} at index ${index} isn't valid`;
        return true;
      }
    });
    if (error) return error;
    query[key] = { $all: query[key] };
  }
};

const updateBlog = (body) => {
  const filters = ["title", "body", "category", "tags", "subCategory"];
  let error = null;

  for (let key in body) {
    if (!filters.includes(key)) {
      delete body[key];
    }
  }
  if (Object.keys(body).length === 0) {
    error = "No valid fields in request body";
    return error;
  }
  body.update = true;
  for (let key in body) {
    if (key === "tags" || key === "subCategory" || key === "update") continue;
    blogDetails = [key];
    error = createBlog(body);
    if (error) return error;
  }
  delete body.update;

  const additionalUpdates = ["tags", "subCategory"];
  for (let key of additionalUpdates) {
    if (!(key in body)) {
      continue;
    }
    if (!Array.isArray(body[key])) {
      body[key] = body[key].trim();
      if (!body[key].length) {
        error = `${key} can't be empty`;
        return error;
      }
      body[key] = [body[key]];

      continue;
    }
    if (!body[key].length) {
      error = `${key} array can't be empty`;
      return error;
    }
    body[key].some((ele, index) => {
      body[key][index] = ele.trim();
      if (!ele.trim().length) {
        error = `${key} at index ${index} isn't valid`;
        return true;
      }
    });
    if (error) return error;
  }
};

module.exports = {
  createBlog,
  getBlogsByQuery,
  updateBlog,
};

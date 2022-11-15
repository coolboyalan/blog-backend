const validator = require("validator");
const authorDetails = ["fname", "lname", "title", "email", "password"];
const fields = new Set([...authorDetails]);
const alphabets = /^[A-Za-z]+$/;
const title = ["Mr", "Mrs", "Miss"];

const signUp = (body) => {
  let error = null;

  for (let key of authorDetails) {
    if (!(key in body)) {
      error = `${key} is missing in request body`;
      return error;
    }
    if (typeof body[key] !== "string") {
      error = `${key} should be a string`;
      return error;
    }

    body[key] = body[key].trim();

    if (key === "fname" || key === "lname") {
      if (body[key].length < 3) {
        error = `${key} is too short`;
        return error;
      }
      if (!alphabets.test(body[key])) {
        error = `${key} isn't valid`;
        return error;
      }
      continue;
    }
    if (key === "title") {
      if (!title.includes(body[key])) {
        error = `${key} can only be from these ${title}`;
        return error;
      }
      continue;
    }
    if (key === "email") {
      if (!validator.isEmail(body[key])) {
        error = `${key} isn't a valid email`;
        return error;
      }
      continue;
    }
    if (key === "password") {
      if (body[key].length < 8) {
        error = `${key} should be atleast 8 characters long`;
        return error;
      }
    }
  }
  for (let key in body) {
    if (!fields.has(key)) {
      delete body[key];
    }
  }
};

module.exports = {
  signUp,
};

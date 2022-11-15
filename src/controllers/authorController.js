const author = require("../models/authorModel");
const isValid = require("../validator/authorValidator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const signUp = async (req, res) => {
  try {
    const error = isValid.signUp(req.body);

    if (error) {
      return res
        .status(400)
        .send({ status: false, message: "please fix the error", error });
    }
    const pass = await bcrypt.hash(req.body.password, 10);
    req.body.password = pass;

    const existing = await author.findOne({ email: req.body.email });
    if (existing) {
      return res
        .status(400)
        .send({ status: false, message: "email already exists" });
    }

    const newAuthor = await author.create(req.body);
    res
      .status(201)
      .send({ status: true, message: "author created", data: newAuthor });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: false, message: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .send({ status: false, message: "please check all fields" });
    }
    if (typeof email !== "string" || !validator.isEmail(email)) {
      return res
        .status(400)
        .send({ status: false, message: "email isn't valid" });
    }
    const existing = await author.findOne({ email });
    if (!existing) {
      return res
        .status(400)
        .send({ status: false, message: "email doesn't exists" });
    }
    const isMatch = await bcrypt.compare(password, existing.password);
    if (!isMatch) {
      return res
        .status(400)
        .send({ status: false, message: "password is incorrect" });
    }
    const token = jwt.sign({ id: existing._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.setHeader("Authorization", token);
    res.status(200).send({ status: true, message: "login successful", token });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: false, message: "Internal server error" });
  }
};

module.exports = {
  signUp,
  login,
};

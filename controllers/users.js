const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

//======> USER SIGNUP
exports.userSignup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: errors.array()[0].msg });
  }

  try {
    let imageUrl = "";
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    const hashPw = await bcrypt.hash(password, 12);
    if (!req.file) {
      return res.status(422).res({ json: "User image not found!" });
    }
    imageUrl = req.file.path.replace(/\\/g, "/");

    const user = await new User({
      email: email,
      password: hashPw,
      name: name,
      image: imageUrl,
    });

    const token = jwt.sign(
      {
        email: email,
        userId: user.id,
      },
      process.env.TOKEN_KEY,
      { expiresIn: "30d" }
    );

    res.status(201).json({
      message: "User added",
      token: token,
      userId: user.id,
      expiresIn: "30d",
    });
  } catch (err) {
    res.status(500).json({ message: "User couldn't signup now. Try again." });
  }
};

//======> USER LOGIN
exports.userLogin = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: errors.array()[0].msg });
  }

  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(422).json({ message: "User not found!" });
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      return res.status(409).json({ message: "User password not match!" });
    }
    const token = jwt.sign(
      {
        email: email,
        userId: user.id,
      },
      process.env.TOKEN_KEY,
      { expiresIn: "30d" }
    );
    res.status(200).json({
      message: "User login successfully",
      token: token,
      userId: user.id,
      expiresIn: "30d",
    });
  } catch (err) {
    res.status(500).json({ message: "User couldn't login now. Try again." });
  }
};

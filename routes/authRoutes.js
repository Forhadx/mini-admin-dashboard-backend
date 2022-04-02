const express = require("express");
const { body } = require("express-validator");
const User = require("../models/User");
const userController = require("../controllers/users");
const fileUpload = require("../middleware/fileUrl");

const router = express.Router();

router.post(
  "/api/signup",
  fileUpload.single("image"),
  [
    body("email", "enter a valid email")
      .isEmail()
      .normalizeEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject("email already exist");
          }
        });
      }),
    body("password", "password is required").trim().isLength({ min: 4 }),
    body("name", "enter your name").trim().notEmpty(),
  ],
  userController.userSignup
);

router.post(
  "/api/login",
  [body("email", "enter a valid email").isEmail().normalizeEmail()],
  userController.userLogin
);

module.exports = router;

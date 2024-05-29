const express = require("express");

const { check, body } = require("express-validator");

const authController = require("../controllers/auth");

const router = express.Router();

const User = require("../models/user");

router.get(
  "/login",

  authController.getLogin
);

router.get("/signup", authController.getSignup);

router.post(
  "/login",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid Email")
      .normalizeEmail(),
    check("password")
      .isLength({ min: 5 })
      .withMessage("Please enter a password longer than 5 characters")
      .isAlphanumeric()
      .trim(),
  ],
  authController.postLogin
);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        // if (value === "test@test.com") {
        //   throw new Error("This email is forbidden.");
        // }
        // return true;
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email already exists.");
          }
        });
      })
      .normalizeEmail(),
    body(
      "password",
      "Please enter a password with only numbers and text that is longer than 5 charaters."
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords must match!");
        }
        return true;
      }),
  ],
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/newPassword", authController.postNewPassword);

module.exports = router;

const { body } = require("express-validator/check");
const User = require("../models/user");

exports.registerValidators = [
  body("email")
    .isEmail()
    .withMessage("Enter your email correctly")
    .custom(async (value, req) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject("This email is already existed");
        }
      } catch (error) {
        console.log(error);
      }
    })
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6, max: 56 })
    .isAlphanumeric()
    .trim()
    .withMessage("Password should be min 6 symbols"),
  body("confirm")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password should be similar");
      }
      return true;
    })
    .trim(),
  body("name")
    .isLength({ min: 4 })
    .trim()
    .withMessage("Name Should be min 4 symbols"),
];
exports.notebookValidators = [
  body("title")
    .isLength({ min: 3 })
    .withMessage("Minimum length for title should be 3 symbols")
    .trim(),
  body("price").isNumeric().withMessage("Write correct price"),
  body("img").isURL().withMessage("Write correct URL image"),
  body("descr").isLength({min: 10}).withMessage("Description should be 10 symbols")
];

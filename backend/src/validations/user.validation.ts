import { body } from "express-validator";
import User from "../models/user.model.js";
import { Request } from "express";

export const registerValidation = [
 
  body("username")
    .notEmpty().withMessage("Username is required")
    .bail()
    .matches(/^[A-Za-z]+$/).withMessage("Username must contain only alphabets")
    .bail()
    .isLength({ min: 3 }).withMessage("Username must be at least 3 characters"),
    // .bail()
    // .custom(async (value) => {
    //   const user = await User.findOne({ where: { username: value } });
    //   if (user) throw new Error("Username already registered");
    // }),

 body("email")
    .notEmpty().withMessage("Email is required")
    .bail()
    .isEmail().withMessage("Invalid email format"),
    // .bail()
    // .custom(async (value) => {
    //   const user = await User.findOne({ where: { email: value } });
    //   if (user) throw new Error("Email already registered");
    // }),


 body("password")
  .notEmpty().withMessage("Password is required")
  .bail()  // ✅ stop if empty

  .isLength({ min: 6 })
  .withMessage("Password must be at least 6 characters")
  .bail()  // ✅ stop if length fails

  .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])/)
  .withMessage(
    "Password must contain alphabets, numbers and at least one special character"
  ),

  body("phone")
    .optional()
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Phone number must be a valid Indian number (10 digits)"),
  

  body("dateofbirth")
    .optional()
    .matches(/^\d{4}\/\d{2}\/\d{2}$/)
    .withMessage("Date of birth must be in YYYY/MM/DD format"),

  body("gender")
    .optional()
    .isIn(["male", "female", "other"])
    .withMessage("Gender must be male, female or other")
];

export const loginValidation = [
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format"),

  body("password")
    .notEmpty().withMessage("Password is required")
];

export const updateUserValidation = [
  body("username")
    .optional()
    .matches(/^[A-Za-z]+$/)
    .withMessage("Username must contain only alphabets")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters")
    .custom(async (value, meta) => {
      const req = meta.req; // get req from meta
      const user = await User.findOne({ where: { username: value } });
      if (user && user.getDataValue("user_id") !== (req.user?.user_id ?? 0)) {
        return Promise.reject("Username already registered");
      }
    }),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (value, meta) => {
      const req = meta.req;
      const user = await User.findOne({ where: { email: value } });
      if (user && user.getDataValue("user_id") !== (req.user?.user_id ?? 0)) {
        return Promise.reject("Email already registered");
      }
    }),

  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])/)
    .withMessage(
      "Password must contain alphabets, numbers and at least one special character"
    ),

  body("phone")
    .optional()
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Phone number must be a valid Indian number (10 digits)"),

  body("gender")
    .optional()
    .isIn(["male", "female", "other"])
    .withMessage("Gender must be male, female or other")
];


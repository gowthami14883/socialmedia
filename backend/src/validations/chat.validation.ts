import { body } from "express-validator";

export const sendMessageValidation = [
  body("message")
    .notEmpty().withMessage("Message is required")
    .isString()
    .isLength({ max: 1000 })
];

export const updateMessageValidation = [
  body("message")
  
    .notEmpty()
    .isString()
    .isLength({ max: 1000 })
];
import { body } from "express-validator";

export const createCommentValidation = [
  body("text")
    .notEmpty().withMessage("Comment text is required")
    .isString()
    .isLength({ max: 300 }).withMessage("Comment too long")
];

export const updateCommentValidation = [
  body("text")
    .notEmpty()
    .isString()
    .isLength({ max: 300 })
];
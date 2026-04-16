import { body } from "express-validator";

export const createPostValidation = [
  body("caption")
    .optional()
    .isString()
    .withMessage("Caption must be text")
];

export const updatePostValidation = [
  body("caption")
    .optional()
    .isString()
    .withMessage("Caption must be text")
];
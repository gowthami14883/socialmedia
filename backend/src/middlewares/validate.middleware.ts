import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import apiResponse from "../utils/apiResponse.js";

const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return apiResponse.validationErrorResponse(
      res,
      "Validation failed",
      errors.array()
    );
  }

  next();
};

export default validate;
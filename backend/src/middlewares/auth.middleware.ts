import jwt from "jsonwebtoken";
import apiResponse from "../utils/apiResponse.js";
import { Request, Response, NextFunction } from "express"; // Use Request, not AuthRequest
import dotenv from "dotenv";

dotenv.config();

export default (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return apiResponse.unauthorizedResponse(res, "Authorization header missing");
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return apiResponse.unauthorizedResponse(res, "Token missing");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      user_id: number;
      email: string;
      username?: string;
    };

    // Assign to req.user (optional in type)
    req.user = {
      user_id: decoded.user_id,
      email: decoded.email,
      username: decoded.username,
    };

    next();
  } catch (err) {
    return apiResponse.unauthorizedResponse(res, "Invalid or expired token");
  }
};
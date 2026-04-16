import { Request } from "express";
import { AuthUser } from "./express.d.js";

export interface AuthRequest extends Request {
  user?: AuthUser;
  files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
}
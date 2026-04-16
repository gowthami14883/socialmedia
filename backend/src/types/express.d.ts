import { Request } from "express";

export interface AuthUser {
  user_id: number;
  email: string;
  username?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser; // optional for TS
      files?: Express.Multer.File[]; // optional for multer files
    }
  }
}

export {};
import { Request, Response } from "express";
import apiResponse from "../utils/apiResponse.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Like from "../models/like.model.js";
import Comment from "../models/comment.model.js";
import Follower from "../models/follower.model.js";
import { Op } from "sequelize";
import dotenv from "dotenv";
import { IncludeOptions } from "sequelize";
import { validationResult } from "express-validator";


dotenv.config();

// ---------------- Helper Functions ----------------
const getSingleParam = (param: string | string[]) => {
  return Array.isArray(param) ? param[0] : param;
};

export const register = async (req: Request, res: Response) => {
  try {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return apiResponse.errorResponse(res, "Validation failed", errors.array(), 400);
    }

    const { username, email, password, phone, dateofbirth, gender, bio } = req.body;
    const existingUsername = await User.findOne({ where: { username } });;
    if (existingUsername) {
      return apiResponse.errorResponse(res, "Username already registered",null,400);
    }
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return apiResponse.errorResponse(res, "Email already registered",null,400);
    }




    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      phone,
      dateofbirth,
      gender,
      bio
    });

    return apiResponse.createdResponse(res, "User registered", user);

  } catch (err: any) {
    return apiResponse.errorResponse(res, err.message);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return apiResponse.notFoundResponse(res, "User not found");
    }

    const isMatch = await bcrypt.compare(password, (user as any).password);
    if (!isMatch) {
      return apiResponse.unauthorizedResponse(res, "Invalid password");
    }

    const token = jwt.sign(
      { user_id: (user as any).user_id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    return apiResponse.successResponse(res, "Login successful", { token });
  } catch (err: any) {
    return apiResponse.errorResponse(res, err.message);
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] }
    });

    return apiResponse.successResponse(res, "Users fetched", users);
  } catch (err: any) {
    return apiResponse.errorResponse(res, err.message);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = getSingleParam(req.params.id);

    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] }
    });

    if (!user) {
      return apiResponse.notFoundResponse(res, "User not found");
    }

    return apiResponse.successResponse(res, "User fetched", user);
  } catch (err: any) {
    return apiResponse.errorResponse(res, err.message);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const updated = await User.update(req.body, {
      where: { user_id: req.params.id }
    });

    if (updated[0] === 0) {
      return apiResponse.notFoundResponse(res, "User not found");
    }

    return apiResponse.successResponse(res, "User updated successfully");
  } catch (err: any) {
    return apiResponse.errorResponse(res, err.message);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const deleted = await User.destroy({
      where: { user_id: req.params.id }
    });

    if (!deleted) {
      return apiResponse.notFoundResponse(res, "User not found");
    }

    return apiResponse.successResponse(res, "User deleted successfully");
  } catch (err: any) {
    return apiResponse.errorResponse(res, err.message);
  }
};

export const getMyProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.user_id;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] }
    });

    if (!user) {
      return apiResponse.notFoundResponse(res, "User not found");
    }

    return apiResponse.successResponse(res, "Profile fetched", user);
  } catch (err: any) {
    return apiResponse.errorResponse(res, err.message);
  }
};

export const getUserFullProfile = async (req: Request, res: Response) => {
  try {
    const userId = getSingleParam(req.params.userId);

    // Type-safe includes
    const includePosts: IncludeOptions = {
      model: Post,
      attributes: ["post_id", "media_url", "caption", "createdAt"]
    };

    const includeFollowers: IncludeOptions = {
      model: Follower,
      as: "Followers",
      include: [
        {
          model: User,
          as: "FollowerUser",
          attributes: ["user_id", "username"]
        } as IncludeOptions
      ]
    };

    const includeFollowing: IncludeOptions = {
      model: Follower,
      as: "Following",
      include: [
        {
          model: User,
          as: "FollowingUser",
          attributes: ["user_id", "username"]
        } as IncludeOptions
      ]
    };

    const user = await User.findByPk(userId, {
      attributes: ["user_id", "username", "email"],
      include: [includePosts, includeFollowers, includeFollowing]
    });

    if (!user) {
      return apiResponse.notFoundResponse(res, "User not found");
    }

    return apiResponse.successResponse(res, "User full profile fetched", user);

  } catch (error: any) {
    return apiResponse.errorResponse(res, error.message);
  }
};

export const searchByUsername = async (req: Request, res: Response) => {
  try {
    const { username } = req.query;

    if (!username) {
      return apiResponse.errorResponse(res, "Username query parameter is required");
    }

    const users = await User.findAll({
      where: {
        username: {
          [Op.like]: `%${username}%`
        }
      },
      attributes: { exclude: ["password"] }
    });

    return apiResponse.successResponse(
      res,
      "Users fetched successfully",
      users
    );

  } catch (err: any) {
    return apiResponse.errorResponse(res, err.message);
  }
};
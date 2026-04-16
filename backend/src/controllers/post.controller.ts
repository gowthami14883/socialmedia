import { Request, Response } from "express";
import apiResponse from "../utils/apiResponse.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { AuthRequest } from "../types/authRequest.js";


export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const caption = req.body.caption || null;

    let mediaPaths: string[] | null = null;

    if (Array.isArray(req.files) && req.files.length > 0) {
  mediaPaths = req.files.map(file => file.path);
}
    if (!caption && (!mediaPaths || mediaPaths.length === 0)) {
      return apiResponse.validationErrorResponse(
        res,
        "Post must contain caption or media"
      );
    }

    const post = await Post.create({
      user_id: req.user!.user_id, // non-null assertion
      caption,
      media_url: mediaPaths
    });

    return apiResponse.createdResponse(res, "Post created successfully", post);
  } catch (error: any) {
    console.error("Create Post Error:", error);
    return apiResponse.errorResponse(res, error.message);
  }
};

export const getMyPosts = async (req: AuthRequest, res: Response)=> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Post.findAndCountAll({
      where: { user_id: req.user!.user_id },
      distinct: true,
      limit,
      offset
    });

    return apiResponse.successResponse(res, "My posts fetched successfully", {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      posts: rows
    });
  } catch (error: any) {
    return apiResponse.errorResponse(res, error.message);
  }
};

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Post.findAndCountAll({
      distinct: true,
      limit,
      offset,
      include: [
        {
          model: User,
          attributes: ["user_id", "username", "profilepic"]
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    return apiResponse.successResponse(res, "All posts fetched successfully", {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      posts: rows
    });
  } catch (error: any) {
    return apiResponse.errorResponse(res, error.message);
  }
};

export const updatePost =  async (req: AuthRequest, res: Response) => {
  try {
    const post = await Post.findOne({
      where: {
        post_id: req.params.postId,
        user_id: req.user!.user_id
      }
    });

    if (!post) {
      return apiResponse.notFoundResponse(res, "Post not found");
    }

    await post.update({
      caption: req.body.caption
    });

    return apiResponse.successResponse(res, "Post updated successfully", post);
  } catch (error: any) {
    return apiResponse.errorResponse(res, error.message);
  }
};

export const deletePost =  async (req: AuthRequest, res: Response) => {
  try {
    const deleted = await Post.destroy({
      where: {
        post_id: req.params.postId,
        user_id: req.user!.user_id
      }
    });

    if (!deleted) {
      return apiResponse.notFoundResponse(res, "Post not found");
    }

    return apiResponse.successResponse(res, "Post deleted successfully");
  } catch (error: any) {
    return apiResponse.errorResponse(res, error.message);
  }
};
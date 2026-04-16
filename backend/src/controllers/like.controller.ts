import { Response } from "express";
import { AuthRequest } from "../types/authRequest.js";
import apiResponse from "../utils/apiResponse.js";
import Like from "../models/like.model.js";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";

/* =========================
   LIKE POST
========================= */

export const likePost = async (req: AuthRequest, res: Response) => {
  try {
    const alreadyLiked = await Like.findOne({
      where: {
        post_id: req.params.postId,
        user_id: req.user!.user_id
      }
    });

    if (alreadyLiked) {
      return apiResponse.validationErrorResponse(
        res,
        "You already liked this post"
      );
    }

    const like = await Like.create({
      post_id: req.params.postId,
      user_id: req.user!.user_id
    });

    const likeDetails: any = await Like.findOne({
      where: { like_id: (like as any).like_id },
      include: [
        {
          model: User,
          attributes: ["user_id", "username"]
        },
        {
          model: Post,
          attributes: ["post_id", "media_url", "caption"],
          include: [
            {
              model: User,
              attributes: ["user_id", "username"]
            }
          ]
        }
      ]
    });

    return apiResponse.createdResponse(
      res,
      "Post liked successfully",
      {
        liked_by: likeDetails.User,
        post: {
          post_id: likeDetails.Post.post_id,
          media_url: likeDetails.Post.media_url,
          caption: likeDetails.Post.caption,
          posted_by: likeDetails.Post.User
        }
      }
    );
  } catch (error: any) {
    return apiResponse.errorResponse(res, error.message);
  }
};


/* =========================
   UNLIKE POST
========================= */

export const unlikePost = async (req: AuthRequest, res: Response) => {
  try {
    const deleted = await Like.destroy({
      where: {
        post_id: req.params.postId,
        user_id: req.user!.user_id
      }
    });

    if (!deleted) {
      return apiResponse.notFoundResponse(res, "Like not found");
    }

    return apiResponse.successResponse(
      res,
      "Post unliked successfully"
    );
  } catch (error: any) {
    return apiResponse.errorResponse(res, error.message);
  }
};


/* =========================
   GET ALL LIKES
========================= */

export const getAllLikes = async (req: AuthRequest, res: Response) => {
  try {
    const likes = await Like.findAll({
      include: [
        {
          model: User,
          attributes: ["user_id", "username"]
        },
        {
          model: Post,
          attributes: ["post_id", "media_url", "caption"],
          include: [
            {
              model: User,
              attributes: ["user_id", "username"]
            }
          ]
        }
      ]
    });

    return apiResponse.successResponse(
      res,
      "All likes fetched successfully",
      likes
    );
  } catch (error: any) {
    return apiResponse.errorResponse(res, error.message);
  }
};


/* =========================
   GET LIKES BY POST
========================= */

export const getLikesByPost = async (req: AuthRequest, res: Response) => {
  try {
    const postId = req.params.postId;
    const loggedInUserId = req.user!.user_id;

    const likes: any = await Like.findAll({
      where: { post_id: postId },
      include: {
        model: User,
        attributes: ["user_id", "username"]
      }
    });

    const likeCount = likes.length;

    const isLiked = likes.some(
      (like: any) => like.user_id === loggedInUserId
    );

    return apiResponse.successResponse(
      res,
      "Post likes fetched successfully",
      {
        likedUsers: likes,
        likeCount,
        isLiked
      }
    );
  } catch (error: any) {
    return apiResponse.errorResponse(res, error.message);
  }
};
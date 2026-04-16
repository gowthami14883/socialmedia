import { Response } from "express";
import apiResponse from "../utils/apiResponse.js";
import Comment from "../models/comment.model.js";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import { AuthRequest } from "../types/authRequest.js";

export const addComment = async (req: AuthRequest, res: Response) => {
  try {
    const comment = await Comment.create({
      text: req.body.text,
      post_id: req.params.postId,
      user_id: req.user!.user_id
    });

    const commentDetails: any = await Comment.findOne({
      where: { comment_id: (comment as any).comment_id },
      include: [
        {
          model: User,
          attributes: ["user_id", "username"]
        },
        {
          model: Post,
          attributes: ["post_id", "caption", "media_url"],
          include:[
             {
            model: User,
            attributes: ["user_id", "username"]
          }
        ]
        }
      ]
    });

    return apiResponse.successResponse(res, "Comment added successfully", {
      comment: commentDetails.text,
      commented_by: commentDetails.User,
      post: {
        post_id: commentDetails.Post.post_id,
        caption: commentDetails.Post.caption,
        media_url: commentDetails.Post.media_url,
        posted_by: commentDetails.Post.User
      }
    });

  } catch (error: any) {
    return apiResponse.errorResponse(res, error.message);
  }
};

export const getCommentsByPost = async (req: AuthRequest, res: Response) => {
  try {
    const postId = req.params.postId;
    const loggedInUserId = req.user!.user_id;

    const comments = await Comment.findAll({
      where: { post_id: req.params.postId },
      include: [
        {
          model: User,
          attributes: ["user_id", "username"]
        },
        {
          model: Post,
          attributes: ["post_id"],
          include:[ {
            model: User,
            attributes: ["user_id", "username"]
          }]
        }
      ]
    });

    const commentCount = comments.length;

    return apiResponse.successResponse(
      res,
      "Comments fetched successfully",
      {
        comments,
        commentCount
      }
    );
  } catch (error: any) {
    return apiResponse.errorResponse(res, error.message);
  }
};

export const updateComment = async (req: AuthRequest, res: Response) => {
  try {
    const comment: any = await Comment.findOne({
      where: {
        comment_id: req.params.commentId,
        user_id: req.user!.user_id
      }
    });

    if (!comment) {
      return apiResponse.notFoundResponse(res, "Comment not found");
    }

    await comment.update({
      text: req.body.text
    });

    return apiResponse.successResponse(
      res,
      "Comment updated successfully",
      comment
    );
  } catch (error: any) {
    return apiResponse.errorResponse(res, error.message);
  }
};

export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    const deleted = await Comment.destroy({
      where: {
        comment_id: req.params.commentId,
        user_id: req.user!.user_id
      }
    });

    if (!deleted) {
      return apiResponse.notFoundResponse(res, "Comment not found");
    }

    return apiResponse.successResponse(
      res,
      "Comment deleted successfully"
    );
  } catch (error: any) {
    return apiResponse.errorResponse(res, error.message);
  }
};

export const getAllComments = async (req: AuthRequest, res: Response) => {
  try {
    const comments = await Comment.findAll({
      include: [
        {
          model: User,
          attributes: ["user_id", "username"]
        },
        {
          model: Post,
          attributes: ["post_id"],
          include: [{
            model: User,
            attributes: ["user_id", "username"]
          }]
        }
      ]
    });

    return apiResponse.successResponse(
      res,
      "All comments fetched successfully",
      comments
    );
  } catch (error: any) {
    return apiResponse.errorResponse(res, error.message);
  }
};
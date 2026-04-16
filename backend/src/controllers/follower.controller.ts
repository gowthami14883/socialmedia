import { Request, Response } from "express";
import apiResponse from "../utils/apiResponse.js";
import Follower from "../models/follower.model.js";
import User from "../models/user.model.js";
import Chat from "../models/chat.model.js";
import { Op } from "sequelize";
import { AuthRequest } from "../types/authRequest.js";

/* =========================
   FOLLOW USER
   ========================= */

export const followUser = async (req: AuthRequest, res: Response) => {
  try {
    const followerId = req.user!.user_id;
    const followingId = Number(req.params.userId);

    if (followerId == followingId) {
      return apiResponse.validationErrorResponse(
        res,
        "You cannot follow yourself"
      );
    }

    const alreadyFollowing = await Follower.findOne({
      where: {
        follower_user_id: followerId,
        following_user_id: followingId
      }
    });

    if (alreadyFollowing) {
      return apiResponse.validationErrorResponse(
        res,
        "You are already following this user"
      );
    }

    const follow = await Follower.create({
      follower_user_id: followerId,
      following_user_id: followingId
    });

    return apiResponse.createdResponse(
      res,
      "User followed successfully",
      follow
    );
  } catch (error: any) {
    return apiResponse.errorResponse(res, error.message);
  }
};

/* =========================
   UNFOLLOW USER
   ========================= */

export const unfollowUser = async (req: AuthRequest, res: Response) => {
  try {
    const deleted = await Follower.destroy({
      where: {
        follower_user_id: req.user!.user_id,
        following_user_id: Number(req.params.userId)
      }
    });

    if (!deleted) {
      return apiResponse.notFoundResponse(
        res,
        "You are not following this user"
      );
    }

    return apiResponse.successResponse(
      res,
      "User unfollowed successfully"
    );
  } catch (error: any) {
    return apiResponse.errorResponse(res, error.message);
  }
};

/* =========================
   GET FOLLOWERS
   ========================= */

export const getFollowers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Follower.findAndCountAll({
      where: {
        following_user_id: Number(req.params.userId)
      },
      include: [
        {
          model: User,
          as: "FollowerUser",
          attributes: ["user_id", "username"]
        }
      ],
      limit,
      offset
    });

    const totalPages = Math.ceil(count / limit);

    return apiResponse.successResponse(
      res,
      "Followers fetched successfully",
      {
        totalItems: count,
        totalPages,
        currentPage: page,
        followers: rows
      }
    );

  } catch (error: any) {
    return apiResponse.errorResponse(res, error.message);
  }
};

/* =========================
   GET FOLLOWING
   ========================= */

export const getFollowing = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Follower.findAndCountAll({
      where: {
        follower_user_id: req.params.userId
      },
      include: [
        {
          model: User,
          as: "FollowingUser",
          attributes: ["user_id", "username"]
        }
      ],
      limit,
      offset
    });

    const totalPages = Math.ceil(count / limit);

    return apiResponse.successResponse(
      res,
      "Following list fetched successfully",
      {
        totalItems: count,
        totalPages,
        currentPage: page,
        following: rows
      }
    );

  } catch (error: any) {
    return apiResponse.errorResponse(res, error.message);
  }
};

/* =========================
   REMOVE FOLLOWER
   ========================= */

export const removeFollower = async (req: AuthRequest, res: Response) => {
  try {
    const loggedInUserId = req.user!.user_id;
    const followerUserId = req.params.userId;

    const deleted = await Follower.destroy({
      where: {
        follower_user_id: followerUserId,
       following_user_id: loggedInUserId
      }
    });

    if (!deleted) {
      return apiResponse.notFoundResponse(
        res,
        "Follower not found"
      );
    }

    return apiResponse.successResponse(
      res,
      "Follower removed successfully"
    );
  } catch (error: any) {
    return apiResponse.errorResponse(res, error.message);
  }
};

/* ===========================================================
   CHAT USERS (Followers + Following + Chat + Search)
   =========================================================== */

export const getChatUsers = async (req: AuthRequest, res: Response) => {
  try {
    const myId = req.user!.user_id;
    const search = (req.query.search as string) || "";

    // 1️⃣ Users I follow
    const following = await Follower.findAll({
      where: { follower_user_id: myId },
      attributes: ["following_user_id"]
    });

    // 2️⃣ Users who follow me
    const followers = await Follower.findAll({
      where: { following_user_id: myId },
      attributes: ["follower_user_id"]
    });

    const followingIds = following.map((f: any) => f.following_user_id);
    const followerIds = followers.map((f: any) => f.follower_user_id);

    // 3️⃣ Users I chatted with
    const chats = await Chat.findAll({
      where: {
        [Op.or]: [
          { sender_id: myId },
          { receiver_id: myId }
        ]
      },
      attributes: ["sender_id", "receiver_id"]
    });

    const chatUserIds = chats.map((chat: any) =>
      chat.sender_id === myId
        ? chat.receiver_id
        : chat.sender_id
    );

    // 4️⃣ Merge all IDs & remove duplicates
    const uniqueUserIds = [
      ...new Set([
        ...followingIds,
        ...followerIds,
        ...chatUserIds
      ])
    ];

    if (uniqueUserIds.length === 0) {
      return apiResponse.successResponse(
        res,
        "No chat users found",
        []
      );
    }

    // 5️⃣ Apply search filter
    const users = await User.findAll({
      where: {
        user_id: {
          [Op.in]: uniqueUserIds
        },
        username: {
          [Op.like]: `%${search}%`
        }
      },
      attributes: ["user_id", "username", "profilepic"]
    });

    return apiResponse.successResponse(
      res,
      "Chat users fetched successfully",
      users
    );

  } catch (error: any) {
    return apiResponse.errorResponse(res, error.message);
  }
};
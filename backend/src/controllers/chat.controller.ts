import { Request, Response } from "express";
import { Op } from "sequelize";
import apiResponse from "../utils/apiResponse.js";
import Chat from "../models/chat.model.js";
import { AuthRequest } from "../types/authRequest.js";

// SEND MESSAGE
export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const message = await Chat.create({
      sender_id: req.user!.user_id,
      receiver_id: req.params.receiverId,
      message: req.body.message
    });

    apiResponse.createdResponse(res, "Message sent", message);
  } catch (error: any) {
    apiResponse.errorResponse(res, error.message);
  }
};

// GET CHATS (with pagination)
export const getChats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const myId = req.user!.user_id;
    const otherId = req.params.userId;

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const { count, rows } = await Chat.findAndCountAll({
      where: {
        [Op.or]: [
          { sender_id: myId, receiver_id: otherId },
          { sender_id: otherId, receiver_id: myId }
        ]
      },
      order: [["createdAt", "DESC"]],
      limit,
      offset
    });

    const totalPages = Math.ceil(count / limit);

    apiResponse.successResponse(res, "Chats fetched", {
      totalMessages: count,
      totalPages,
      currentPage: page,
      chats: rows
    });

  } catch (error: any) {
    apiResponse.errorResponse(res, error.message);
  }
};

// UPDATE MESSAGE
export const updateMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const chat: any = await Chat.findOne({
      where: {
        chat_id: req.params.messageId,
        sender_id: req.user!.user_id
      }
    });

    if (!chat) {
      apiResponse.notFoundResponse(res, "Message not found");
      return;
    }

    await chat.update({ message: req.body.message });

    apiResponse.successResponse(res, "Message updated", chat);
  } catch (error: any) {
    apiResponse.errorResponse(res, error.message);
  }
};

// DELETE MESSAGE
export const deleteMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const deleted = await Chat.destroy({
      where: {
        chat_id: req.params.messageId,
        sender_id: req.user!.user_id
      }
    });

    if (!deleted) {
      apiResponse.notFoundResponse(res, "Message not found");
      return;
    }

    apiResponse.successResponse(res, "Message deleted");
  } catch (error: any) {
    apiResponse.errorResponse(res, error.message);
  }
};
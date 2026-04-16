import {
  sendMessage,
  getChats,
  updateMessage,
  deleteMessage
} from "../../controllers/chat.controller.js";
import Chat from "../../models/chat.model.js";
import apiResponse from "../../utils/apiResponse.js";
import { Op } from "sequelize";

jest.mock("../../models/chat.model.js");
jest.mock("../../utils/apiResponse.js");

describe("Chat Controller - Unit Tests", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      body: { message: "Hello there" },
      params: { receiverId: "2", userId: "2", messageId: "30" },
      query: {},
      user: { user_id: 1 }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  describe("sendMessage", () => {
    it("should create a chat message", async () => {
      const message = {
        chat_id: 30,
        sender_id: 1,
        receiver_id: "2",
        message: "Hello there"
      };

      (Chat.create as jest.Mock).mockResolvedValue(message);

      await sendMessage(req, res);

      expect(Chat.create).toHaveBeenCalledWith({
        sender_id: 1,
        receiver_id: "2",
        message: "Hello there"
      });
      expect(apiResponse.createdResponse).toHaveBeenCalledWith(
        res,
        "Message sent",
        message
      );
    });

    it("should handle send message errors", async () => {
      (Chat.create as jest.Mock).mockRejectedValue(new Error("Send failed"));

      await sendMessage(req, res);

      expect(apiResponse.errorResponse).toHaveBeenCalledWith(res, "Send failed");
    });
  });

  describe("getChats", () => {
    it("should fetch chats with pagination", async () => {
      req.query = { page: "2", limit: "2" };
      const rows = [
        { chat_id: 1, message: "Hi" },
        { chat_id: 2, message: "Hello" }
      ];

      (Chat.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 5,
        rows
      });

      await getChats(req, res);

      expect(Chat.findAndCountAll).toHaveBeenCalledWith({
        where: {
          [Op.or]: [
            { sender_id: 1, receiver_id: "2" },
            { sender_id: "2", receiver_id: 1 }
          ]
        },
        order: [["createdAt", "DESC"]],
        limit: 2,
        offset: 2
      });
      expect(apiResponse.successResponse).toHaveBeenCalledWith(
        res,
        "Chats fetched",
        {
          totalMessages: 5,
          totalPages: 3,
          currentPage: 2,
          chats: rows
        }
      );
    });

    it("should use default pagination values when query is missing", async () => {
      (Chat.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 0,
        rows: []
      });

      await getChats(req, res);

      expect(Chat.findAndCountAll).toHaveBeenCalledWith({
        where: {
          [Op.or]: [
            { sender_id: 1, receiver_id: "2" },
            { sender_id: "2", receiver_id: 1 }
          ]
        },
        order: [["createdAt", "DESC"]],
        limit: 20,
        offset: 0
      });
    });

    it("should handle get chats errors", async () => {
      (Chat.findAndCountAll as jest.Mock).mockRejectedValue(new Error("Fetch failed"));

      await getChats(req, res);

      expect(apiResponse.errorResponse).toHaveBeenCalledWith(res, "Fetch failed");
    });
  });

  describe("updateMessage", () => {
    it("should return not found when the sender does not own the message", async () => {
      (Chat.findOne as jest.Mock).mockResolvedValue(null);

      await updateMessage(req, res);

      expect(Chat.findOne).toHaveBeenCalledWith({
        where: {
          chat_id: "30",
          sender_id: 1
        }
      });
      expect(apiResponse.notFoundResponse).toHaveBeenCalledWith(
        res,
        "Message not found"
      );
    });

    it("should update a chat message successfully", async () => {
      const chat = {
        chat_id: 30,
        message: "Old",
        update: jest.fn().mockResolvedValue(undefined)
      };

      (Chat.findOne as jest.Mock).mockResolvedValue(chat);

      await updateMessage(req, res);

      expect(chat.update).toHaveBeenCalledWith({ message: "Hello there" });
      expect(apiResponse.successResponse).toHaveBeenCalledWith(
        res,
        "Message updated",
        chat
      );
    });

    it("should handle update message errors", async () => {
      (Chat.findOne as jest.Mock).mockRejectedValue(new Error("Update failed"));

      await updateMessage(req, res);

      expect(apiResponse.errorResponse).toHaveBeenCalledWith(res, "Update failed");
    });
  });

  describe("deleteMessage", () => {
    it("should return not found when deleting a missing message", async () => {
      (Chat.destroy as jest.Mock).mockResolvedValue(0);

      await deleteMessage(req, res);

      expect(Chat.destroy).toHaveBeenCalledWith({
        where: {
          chat_id: "30",
          sender_id: 1
        }
      });
      expect(apiResponse.notFoundResponse).toHaveBeenCalledWith(
        res,
        "Message not found"
      );
    });

    it("should delete a message successfully", async () => {
      (Chat.destroy as jest.Mock).mockResolvedValue(1);

      await deleteMessage(req, res);

      expect(apiResponse.successResponse).toHaveBeenCalledWith(
        res,
        "Message deleted"
      );
    });

    it("should handle delete message errors", async () => {
      (Chat.destroy as jest.Mock).mockRejectedValue(new Error("Delete failed"));

      await deleteMessage(req, res);

      expect(apiResponse.errorResponse).toHaveBeenCalledWith(res, "Delete failed");
    });
  });
});

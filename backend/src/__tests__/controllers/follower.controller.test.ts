import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  removeFollower,
  getChatUsers
} from "../../controllers/follower.controller.js";
import Follower from "../../models/follower.model.js";
import User from "../../models/user.model.js";
import Chat from "../../models/chat.model.js";
import apiResponse from "../../utils/apiResponse.js";
import { Op } from "sequelize";

jest.mock("../../models/follower.model.js");
jest.mock("../../models/user.model.js");
jest.mock("../../models/chat.model.js");
jest.mock("../../utils/apiResponse.js");

describe("Follower Controller - Unit Tests", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      params: { userId: "2" },
      query: {},
      user: { user_id: 1 }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  describe("followUser", () => {
    it("should prevent a user from following themselves", async () => {
      req.params.userId = "1";
      (apiResponse.validationErrorResponse as jest.Mock).mockReturnValue("SELF");

      const result = await followUser(req, res);

      expect(Follower.findOne).not.toHaveBeenCalled();
      expect(result).toBe("SELF");
      expect(apiResponse.validationErrorResponse).toHaveBeenCalledWith(
        res,
        "You cannot follow yourself"
      );
    });

    it("should prevent duplicate follows", async () => {
      (Follower.findOne as jest.Mock).mockResolvedValue({ follower_id: 10 });
      (apiResponse.validationErrorResponse as jest.Mock).mockReturnValue("DUPLICATE");

      const result = await followUser(req, res);

      expect(Follower.findOne).toHaveBeenCalledWith({
        where: {
          follower_user_id: 1,
          following_user_id: 2
        }
      });
      expect(Follower.create).not.toHaveBeenCalled();
      expect(result).toBe("DUPLICATE");
    });

    it("should create a follow relationship", async () => {
      const followRecord = {
        follower_id: 99,
        follower_user_id: 1,
        following_user_id: 2
      };

      (Follower.findOne as jest.Mock).mockResolvedValue(null);
      (Follower.create as jest.Mock).mockResolvedValue(followRecord);
      (apiResponse.createdResponse as jest.Mock).mockReturnValue("CREATED");

      const result = await followUser(req, res);

      expect(Follower.create).toHaveBeenCalledWith({
        follower_user_id: 1,
        following_user_id: 2
      });
      expect(result).toBe("CREATED");
      expect(apiResponse.createdResponse).toHaveBeenCalledWith(
        res,
        "User followed successfully",
        followRecord
      );
    });

    it("should handle database errors while following", async () => {
      (Follower.findOne as jest.Mock).mockRejectedValue(new Error("DB error"));
      (apiResponse.errorResponse as jest.Mock).mockReturnValue("ERROR");

      const result = await followUser(req, res);

      expect(result).toBe("ERROR");
      expect(apiResponse.errorResponse).toHaveBeenCalledWith(res, "DB error");
    });
  });

  describe("unfollowUser", () => {
    it("should return not found when no follow relationship exists", async () => {
      (Follower.destroy as jest.Mock).mockResolvedValue(0);
      (apiResponse.notFoundResponse as jest.Mock).mockReturnValue("NOT_FOUND");

      const result = await unfollowUser(req, res);

      expect(Follower.destroy).toHaveBeenCalledWith({
        where: {
          follower_user_id: 1,
          following_user_id: 2
        }
      });
      expect(result).toBe("NOT_FOUND");
    });

    it("should unfollow successfully", async () => {
      (Follower.destroy as jest.Mock).mockResolvedValue(1);
      (apiResponse.successResponse as jest.Mock).mockReturnValue("SUCCESS");

      const result = await unfollowUser(req, res);

      expect(result).toBe("SUCCESS");
      expect(apiResponse.successResponse).toHaveBeenCalledWith(
        res,
        "User unfollowed successfully"
      );
    });
  });

  describe("getFollowers", () => {
    it("should fetch followers with pagination metadata", async () => {
      req.query = { page: "2", limit: "2" };
      const rows = [
        {
          follower_user_id: 3,
          FollowerUser: { user_id: 3, username: "alice" }
        }
      ];

      (Follower.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 5,
        rows
      });
      (apiResponse.successResponse as jest.Mock).mockReturnValue("SUCCESS");

      const result = await getFollowers(req, res);

      expect(Follower.findAndCountAll).toHaveBeenCalledWith({
        where: {
          following_user_id: 2
        },
        include: [
          {
            model: User,
            as: "FollowerUser",
            attributes: ["user_id", "username"]
          }
        ],
        limit: 2,
        offset: 2
      });
      expect(result).toBe("SUCCESS");
      expect(apiResponse.successResponse).toHaveBeenCalledWith(
        res,
        "Followers fetched successfully",
        {
          totalItems: 5,
          totalPages: 3,
          currentPage: 2,
          followers: rows
        }
      );
    });
  });

  describe("getFollowing", () => {
    it("should use default pagination when query params are missing", async () => {
      const rows = [
        {
          following_user_id: 2,
          FollowingUser: { user_id: 2, username: "bob" }
        }
      ];

      (Follower.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 1,
        rows
      });
      (apiResponse.successResponse as jest.Mock).mockReturnValue("SUCCESS");

      const result = await getFollowing(req, res);

      expect(Follower.findAndCountAll).toHaveBeenCalledWith({
        where: {
          follower_user_id: "2"
        },
        include: [
          {
            model: User,
            as: "FollowingUser",
            attributes: ["user_id", "username"]
          }
        ],
        limit: 10,
        offset: 0
      });
      expect(result).toBe("SUCCESS");
      expect(apiResponse.successResponse).toHaveBeenCalledWith(
        res,
        "Following list fetched successfully",
        {
          totalItems: 1,
          totalPages: 1,
          currentPage: 1,
          following: rows
        }
      );
    });
  });

  describe("removeFollower", () => {
    it("should remove a follower from the logged in user", async () => {
      req.params.userId = "7";
      (Follower.destroy as jest.Mock).mockResolvedValue(1);
      (apiResponse.successResponse as jest.Mock).mockReturnValue("SUCCESS");

      const result = await removeFollower(req, res);

      expect(Follower.destroy).toHaveBeenCalledWith({
        where: {
          follower_user_id: "7",
          following_user_id: 1
        }
      });
      expect(result).toBe("SUCCESS");
      expect(apiResponse.successResponse).toHaveBeenCalledWith(
        res,
        "Follower removed successfully"
      );
    });

    it("should return not found when the follower does not exist", async () => {
      (Follower.destroy as jest.Mock).mockResolvedValue(0);
      (apiResponse.notFoundResponse as jest.Mock).mockReturnValue("NOT_FOUND");

      const result = await removeFollower(req, res);

      expect(result).toBe("NOT_FOUND");
      expect(apiResponse.notFoundResponse).toHaveBeenCalledWith(
        res,
        "Follower not found"
      );
    });
  });

  describe("getChatUsers", () => {
    it("should return an empty list when no related chat users exist", async () => {
      (Follower.findAll as jest.Mock)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);
      (Chat.findAll as jest.Mock).mockResolvedValue([]);
      (apiResponse.successResponse as jest.Mock).mockReturnValue("EMPTY");

      const result = await getChatUsers(req, res);

      expect(User.findAll).not.toHaveBeenCalled();
      expect(result).toBe("EMPTY");
      expect(apiResponse.successResponse).toHaveBeenCalledWith(
        res,
        "No chat users found",
        []
      );
    });

    it("should merge following, followers, and chat users with search applied", async () => {
      req.query.search = "al";

      (Follower.findAll as jest.Mock)
        .mockResolvedValueOnce([
          { following_user_id: 2 },
          { following_user_id: 3 }
        ])
        .mockResolvedValueOnce([
          { follower_user_id: 3 },
          { follower_user_id: 4 }
        ]);

      (Chat.findAll as jest.Mock).mockResolvedValue([
        { sender_id: 1, receiver_id: 5 },
        { sender_id: 6, receiver_id: 1 },
        { sender_id: 1, receiver_id: 3 }
      ]);

      const users = [
        { user_id: 3, username: "alice", profilepic: "a.jpg" },
        { user_id: 5, username: "alex", profilepic: "b.jpg" }
      ];

      (User.findAll as jest.Mock).mockResolvedValue(users);
      (apiResponse.successResponse as jest.Mock).mockReturnValue("SUCCESS");

      const result = await getChatUsers(req, res);

      expect(User.findAll).toHaveBeenCalledWith({
        where: {
          user_id: {
            [Op.in]: [2, 3, 4, 5, 6]
          },
          username: {
            [Op.like]: "%al%"
          }
        },
        attributes: ["user_id", "username", "profilepic"]
      });
      expect(result).toBe("SUCCESS");
      expect(apiResponse.successResponse).toHaveBeenCalledWith(
        res,
        "Chat users fetched successfully",
        users
      );
    });
  });
});

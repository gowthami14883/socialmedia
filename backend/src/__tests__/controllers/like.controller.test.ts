import {
  likePost,
  unlikePost,
  getAllLikes,
  getLikesByPost
} from "../../controllers/like.controller.js";
import Like from "../../models/like.model.js";
import User from "../../models/user.model.js";
import Post from "../../models/post.model.js";
import apiResponse from "../../utils/apiResponse.js";

jest.mock("../../models/like.model.js");
jest.mock("../../models/user.model.js");
jest.mock("../../models/post.model.js");
jest.mock("../../utils/apiResponse.js");

describe("Like Controller - Unit Tests", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      params: { postId: "10" },
      user: { user_id: 1 }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  describe("likePost", () => {
    it("should prevent liking a post twice", async () => {
      (Like.findOne as jest.Mock).mockResolvedValueOnce({ like_id: 1 });
      (apiResponse.validationErrorResponse as jest.Mock).mockReturnValue("VALIDATION");

      const result = await likePost(req, res);

      expect(Like.findOne).toHaveBeenCalledWith({
        where: {
          post_id: "10",
          user_id: 1
        }
      });
      expect(Like.create).not.toHaveBeenCalled();
      expect(result).toBe("VALIDATION");
      expect(apiResponse.validationErrorResponse).toHaveBeenCalledWith(
        res,
        "You already liked this post"
      );
    });

    it("should like a post and return details", async () => {
      (Like.findOne as jest.Mock)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({
          User: { user_id: 1, username: "gowthami" },
          Post: {
            post_id: 10,
            media_url: ["uploads/posts/a.jpg"],
            caption: "Hello",
            User: { user_id: 2, username: "author" }
          }
        });
      (Like.create as jest.Mock).mockResolvedValue({ like_id: 12 });
      (apiResponse.createdResponse as jest.Mock).mockReturnValue("CREATED");

      const result = await likePost(req, res);

      expect(Like.create).toHaveBeenCalledWith({
        post_id: "10",
        user_id: 1
      });
      expect(Like.findOne).toHaveBeenLastCalledWith({
        where: { like_id: 12 },
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
      expect(result).toBe("CREATED");
      expect(apiResponse.createdResponse).toHaveBeenCalledWith(
        res,
        "Post liked successfully",
        {
          liked_by: { user_id: 1, username: "gowthami" },
          post: {
            post_id: 10,
            media_url: ["uploads/posts/a.jpg"],
            caption: "Hello",
            posted_by: { user_id: 2, username: "author" }
          }
        }
      );
    });

    it("should handle like errors", async () => {
      (Like.findOne as jest.Mock).mockRejectedValue(new Error("DB error"));
      (apiResponse.errorResponse as jest.Mock).mockReturnValue("ERROR");

      const result = await likePost(req, res);

      expect(result).toBe("ERROR");
      expect(apiResponse.errorResponse).toHaveBeenCalledWith(res, "DB error");
    });
  });

  describe("unlikePost", () => {
    it("should return not found when like does not exist", async () => {
      (Like.destroy as jest.Mock).mockResolvedValue(0);
      (apiResponse.notFoundResponse as jest.Mock).mockReturnValue("NOT_FOUND");

      const result = await unlikePost(req, res);

      expect(Like.destroy).toHaveBeenCalledWith({
        where: {
          post_id: "10",
          user_id: 1
        }
      });
      expect(result).toBe("NOT_FOUND");
      expect(apiResponse.notFoundResponse).toHaveBeenCalledWith(
        res,
        "Like not found"
      );
    });

    it("should unlike a post successfully", async () => {
      (Like.destroy as jest.Mock).mockResolvedValue(1);
      (apiResponse.successResponse as jest.Mock).mockReturnValue("SUCCESS");

      const result = await unlikePost(req, res);

      expect(result).toBe("SUCCESS");
      expect(apiResponse.successResponse).toHaveBeenCalledWith(
        res,
        "Post unliked successfully"
      );
    });
  });

  describe("getAllLikes", () => {
    it("should fetch all likes with user and post data", async () => {
      const likes = [{ like_id: 1 }];

      (Like.findAll as jest.Mock).mockResolvedValue(likes);
      (apiResponse.successResponse as jest.Mock).mockReturnValue("SUCCESS");

      const result = await getAllLikes(req, res);

      expect(Like.findAll).toHaveBeenCalledWith({
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
      expect(result).toBe("SUCCESS");
      expect(apiResponse.successResponse).toHaveBeenCalledWith(
        res,
        "All likes fetched successfully",
        likes
      );
    });

    it("should handle get all likes errors", async () => {
      (Like.findAll as jest.Mock).mockRejectedValue(new Error("Fetch failed"));
      (apiResponse.errorResponse as jest.Mock).mockReturnValue("ERROR");

      const result = await getAllLikes(req, res);

      expect(result).toBe("ERROR");
      expect(apiResponse.errorResponse).toHaveBeenCalledWith(res, "Fetch failed");
    });
  });

  describe("getLikesByPost", () => {
    it("should return likes, count, and liked state for the current user", async () => {
      const likes = [
        { like_id: 1, user_id: 1, User: { user_id: 1, username: "gowthami" } },
        { like_id: 2, user_id: 3, User: { user_id: 3, username: "alex" } }
      ];

      (Like.findAll as jest.Mock).mockResolvedValue(likes);
      (apiResponse.successResponse as jest.Mock).mockReturnValue("SUCCESS");

      const result = await getLikesByPost(req, res);

      expect(Like.findAll).toHaveBeenCalledWith({
        where: { post_id: "10" },
        include: {
          model: User,
          attributes: ["user_id", "username"]
        }
      });
      expect(result).toBe("SUCCESS");
      expect(apiResponse.successResponse).toHaveBeenCalledWith(
        res,
        "Post likes fetched successfully",
        {
          likedUsers: likes,
          likeCount: 2,
          isLiked: true
        }
      );
    });

    it("should return isLiked false when current user has not liked the post", async () => {
      const likes = [
        { like_id: 2, user_id: 3, User: { user_id: 3, username: "alex" } }
      ];

      (Like.findAll as jest.Mock).mockResolvedValue(likes);
      (apiResponse.successResponse as jest.Mock).mockReturnValue("SUCCESS");

      const result = await getLikesByPost(req, res);

      expect(result).toBe("SUCCESS");
      expect(apiResponse.successResponse).toHaveBeenCalledWith(
        res,
        "Post likes fetched successfully",
        {
          likedUsers: likes,
          likeCount: 1,
          isLiked: false
        }
      );
    });

    it("should handle get likes by post errors", async () => {
      (Like.findAll as jest.Mock).mockRejectedValue(new Error("DB error"));
      (apiResponse.errorResponse as jest.Mock).mockReturnValue("ERROR");

      const result = await getLikesByPost(req, res);

      expect(result).toBe("ERROR");
      expect(apiResponse.errorResponse).toHaveBeenCalledWith(res, "DB error");
    });
  });
});

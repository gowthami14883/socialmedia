import {
  createPost,
  getMyPosts,
  getAllPosts,
  updatePost,
  deletePost
} from "../../controllers/post.controller.js";
import Post from "../../models/post.model.js";
import User from "../../models/user.model.js";
import apiResponse from "../../utils/apiResponse.js";

jest.mock("../../models/post.model.js");
jest.mock("../../models/user.model.js");
jest.mock("../../utils/apiResponse.js");

describe("Post Controller - Unit Tests", () => {
  let req: any;
  let res: any;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    req = {
      body: {
        caption: "My first post"
      },
      params: {
        postId: "10"
      },
      query: {},
      files: [],
      user: {
        user_id: 1
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    jest.clearAllMocks();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe("createPost", () => {
    it("should fail when both caption and media are missing", async () => {
      req.body.caption = "";
      req.files = [];

      (apiResponse.validationErrorResponse as jest.Mock).mockReturnValue("VALIDATION_ERROR");

      const result = await createPost(req, res);

      expect(Post.create).not.toHaveBeenCalled();
      expect(result).toBe("VALIDATION_ERROR");
      expect(apiResponse.validationErrorResponse).toHaveBeenCalledWith(
        res,
        "Post must contain caption or media"
      );
    });

    it("should create a post with caption only", async () => {
      const createdPost = {
        post_id: 10,
        user_id: 1,
        caption: "My first post",
        media_url: null
      };

      (Post.create as jest.Mock).mockResolvedValue(createdPost);
      (apiResponse.createdResponse as jest.Mock).mockReturnValue("CREATED");

      const result = await createPost(req, res);

      expect(Post.create).toHaveBeenCalledWith({
        user_id: 1,
        caption: "My first post",
        media_url: null
      });
      expect(result).toBe("CREATED");
      expect(apiResponse.createdResponse).toHaveBeenCalledWith(
        res,
        "Post created successfully",
        createdPost
      );
    });

    it("should create a post with uploaded media paths", async () => {
      req.body.caption = null;
      req.files = [
        { path: "uploads/posts/a.jpg" },
        { path: "uploads/posts/b.jpg" }
      ];

      const createdPost = {
        post_id: 11,
        user_id: 1,
        caption: null,
        media_url: ["uploads/posts/a.jpg", "uploads/posts/b.jpg"]
      };

      (Post.create as jest.Mock).mockResolvedValue(createdPost);
      (apiResponse.createdResponse as jest.Mock).mockReturnValue("CREATED");

      const result = await createPost(req, res);

      expect(Post.create).toHaveBeenCalledWith({
        user_id: 1,
        caption: null,
        media_url: ["uploads/posts/a.jpg", "uploads/posts/b.jpg"]
      });
      expect(result).toBe("CREATED");
    });

    it("should handle create errors", async () => {
      (Post.create as jest.Mock).mockRejectedValue(new Error("DB error"));
      (apiResponse.errorResponse as jest.Mock).mockReturnValue("ERROR");

      const result = await createPost(req, res);

      expect(result).toBe("ERROR");
      expect(apiResponse.errorResponse).toHaveBeenCalledWith(res, "DB error");
    });
  });

  describe("getMyPosts", () => {
    it("should fetch the logged in user's posts with pagination", async () => {
      req.query = { page: "2", limit: "2" };
      const rows = [
        { post_id: 21, caption: "One", user_id: 1 },
        { post_id: 22, caption: "Two", user_id: 1 }
      ];

      (Post.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 5,
        rows
      });
      (apiResponse.successResponse as jest.Mock).mockReturnValue("SUCCESS");

      const result = await getMyPosts(req, res);

      expect(Post.findAndCountAll).toHaveBeenCalledWith({
        where: { user_id: 1 },
        distinct: true,
        limit: 2,
        offset: 2
      });
      expect(result).toBe("SUCCESS");
      expect(apiResponse.successResponse).toHaveBeenCalledWith(
        res,
        "My posts fetched successfully",
        {
          totalItems: 5,
          totalPages: 3,
          currentPage: 2,
          posts: rows
        }
      );
    });

    it("should use default pagination values for my posts", async () => {
      (Post.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 0,
        rows: []
      });
      (apiResponse.successResponse as jest.Mock).mockReturnValue("SUCCESS");

      const result = await getMyPosts(req, res);

      expect(Post.findAndCountAll).toHaveBeenCalledWith({
        where: { user_id: 1 },
        distinct: true,
        limit: 10,
        offset: 0
      });
      expect(result).toBe("SUCCESS");
    });

    it("should handle errors while fetching my posts", async () => {
      (Post.findAndCountAll as jest.Mock).mockRejectedValue(new Error("DB error"));
      (apiResponse.errorResponse as jest.Mock).mockReturnValue("ERROR");

      const result = await getMyPosts(req, res);

      expect(result).toBe("ERROR");
      expect(apiResponse.errorResponse).toHaveBeenCalledWith(res, "DB error");
    });
  });

  describe("getAllPosts", () => {
    it("should fetch all posts with author details", async () => {
      req.query = { page: "1", limit: "3" };
      const rows = [
        {
          post_id: 31,
          caption: "Hello",
          User: { user_id: 1, username: "gowthami", profilepic: "pic.jpg" }
        }
      ];

      (Post.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 1,
        rows
      });
      (apiResponse.successResponse as jest.Mock).mockReturnValue("SUCCESS");

      const result = await getAllPosts(req, res);

      expect(Post.findAndCountAll).toHaveBeenCalledWith({
        distinct: true,
        limit: 3,
        offset: 0,
        include: [
          {
            model: User,
            attributes: ["user_id", "username", "profilepic"]
          }
        ],
        order: [["createdAt", "DESC"]]
      });
      expect(result).toBe("SUCCESS");
      expect(apiResponse.successResponse).toHaveBeenCalledWith(
        res,
        "All posts fetched successfully",
        {
          totalItems: 1,
          totalPages: 1,
          currentPage: 1,
          posts: rows
        }
      );
    });

    it("should handle errors while fetching all posts", async () => {
      (Post.findAndCountAll as jest.Mock).mockRejectedValue(new Error("Fetch failed"));
      (apiResponse.errorResponse as jest.Mock).mockReturnValue("ERROR");

      const result = await getAllPosts(req, res);

      expect(result).toBe("ERROR");
      expect(apiResponse.errorResponse).toHaveBeenCalledWith(res, "Fetch failed");
    });
  });

  describe("updatePost", () => {
    it("should return not found when the post does not belong to the user", async () => {
      (Post.findOne as jest.Mock).mockResolvedValue(null);
      (apiResponse.notFoundResponse as jest.Mock).mockReturnValue("NOT_FOUND");

      const result = await updatePost(req, res);

      expect(Post.findOne).toHaveBeenCalledWith({
        where: {
          post_id: "10",
          user_id: 1
        }
      });
      expect(result).toBe("NOT_FOUND");
      expect(apiResponse.notFoundResponse).toHaveBeenCalledWith(
        res,
        "Post not found"
      );
    });

    it("should update a post caption successfully", async () => {
      const post = {
        post_id: 10,
        caption: "Old caption",
        update: jest.fn().mockResolvedValue(undefined)
      };

      (Post.findOne as jest.Mock).mockResolvedValue(post);
      (apiResponse.successResponse as jest.Mock).mockReturnValue("SUCCESS");

      const result = await updatePost(req, res);

      expect(post.update).toHaveBeenCalledWith({
        caption: "My first post"
      });
      expect(result).toBe("SUCCESS");
      expect(apiResponse.successResponse).toHaveBeenCalledWith(
        res,
        "Post updated successfully",
        post
      );
    });

    it("should handle update errors", async () => {
      (Post.findOne as jest.Mock).mockRejectedValue(new Error("Update failed"));
      (apiResponse.errorResponse as jest.Mock).mockReturnValue("ERROR");

      const result = await updatePost(req, res);

      expect(result).toBe("ERROR");
      expect(apiResponse.errorResponse).toHaveBeenCalledWith(res, "Update failed");
    });
  });

  describe("deletePost", () => {
    it("should return not found when deleting a missing post", async () => {
      (Post.destroy as jest.Mock).mockResolvedValue(0);
      (apiResponse.notFoundResponse as jest.Mock).mockReturnValue("NOT_FOUND");

      const result = await deletePost(req, res);

      expect(Post.destroy).toHaveBeenCalledWith({
        where: {
          post_id: "10",
          user_id: 1
        }
      });
      expect(result).toBe("NOT_FOUND");
      expect(apiResponse.notFoundResponse).toHaveBeenCalledWith(
        res,
        "Post not found"
      );
    });

    it("should delete a post successfully", async () => {
      (Post.destroy as jest.Mock).mockResolvedValue(1);
      (apiResponse.successResponse as jest.Mock).mockReturnValue("SUCCESS");

      const result = await deletePost(req, res);

      expect(result).toBe("SUCCESS");
      expect(apiResponse.successResponse).toHaveBeenCalledWith(
        res,
        "Post deleted successfully"
      );
    });

    it("should handle delete errors", async () => {
      (Post.destroy as jest.Mock).mockRejectedValue(new Error("Delete failed"));
      (apiResponse.errorResponse as jest.Mock).mockReturnValue("ERROR");

      const result = await deletePost(req, res);

      expect(result).toBe("ERROR");
      expect(apiResponse.errorResponse).toHaveBeenCalledWith(res, "Delete failed");
    });
  });
});

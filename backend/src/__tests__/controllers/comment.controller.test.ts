import {
  addComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
  getAllComments
} from "../../controllers/comment.controller.js";
import Comment from "../../models/comment.model.js";
import User from "../../models/user.model.js";
import Post from "../../models/post.model.js";
import apiResponse from "../../utils/apiResponse.js";

jest.mock("../../models/comment.model.js");
jest.mock("../../models/user.model.js");
jest.mock("../../models/post.model.js");
jest.mock("../../utils/apiResponse.js");

describe("Comment Controller - Unit Tests", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      body: { text: "Nice post" },
      params: { postId: "10", commentId: "20" },
      user: { user_id: 1 }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  describe("addComment", () => {
    it("should create a comment and return comment details", async () => {
      (Comment.create as jest.Mock).mockResolvedValue({ comment_id: 20 });
      (Comment.findOne as jest.Mock).mockResolvedValue({
        text: "Nice post",
        User: { user_id: 1, username: "gowthami" },
        Post: {
          post_id: 10,
          caption: "Hello",
          media_url: ["uploads/posts/a.jpg"],
          User: { user_id: 2, username: "author" }
        }
      });
      (apiResponse.successResponse as jest.Mock).mockReturnValue("SUCCESS");

      const result = await addComment(req, res);

      expect(Comment.create).toHaveBeenCalledWith({
        text: "Nice post",
        post_id: "10",
        user_id: 1
      });
      expect(Comment.findOne).toHaveBeenCalledWith({
        where: { comment_id: 20 },
        include: [
          {
            model: User,
            attributes: ["user_id", "username"]
          },
          {
            model: Post,
            attributes: ["post_id", "caption", "media_url"],
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
        "Comment added successfully",
        {
          comment: "Nice post",
          commented_by: { user_id: 1, username: "gowthami" },
          post: {
            post_id: 10,
            caption: "Hello",
            media_url: ["uploads/posts/a.jpg"],
            posted_by: { user_id: 2, username: "author" }
          }
        }
      );
    });

    it("should handle add comment errors", async () => {
      (Comment.create as jest.Mock).mockRejectedValue(new Error("DB error"));
      (apiResponse.errorResponse as jest.Mock).mockReturnValue("ERROR");

      const result = await addComment(req, res);

      expect(result).toBe("ERROR");
      expect(apiResponse.errorResponse).toHaveBeenCalledWith(res, "DB error");
    });
  });

  describe("getCommentsByPost", () => {
    it("should fetch comments for a post with count", async () => {
      const comments = [
        {
          comment_id: 1,
          text: "First",
          User: { user_id: 1, username: "gowthami" }
        },
        {
          comment_id: 2,
          text: "Second",
          User: { user_id: 3, username: "alex" }
        }
      ];

      (Comment.findAll as jest.Mock).mockResolvedValue(comments);
      (apiResponse.successResponse as jest.Mock).mockReturnValue("SUCCESS");

      const result = await getCommentsByPost(req, res);

      expect(Comment.findAll).toHaveBeenCalledWith({
        where: { post_id: "10" },
        include: [
          {
            model: User,
            attributes: ["user_id", "username"]
          },
          {
            model: Post,
            attributes: ["post_id"],
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
        "Comments fetched successfully",
        {
          comments,
          commentCount: 2
        }
      );
    });

    it("should handle fetch comment errors", async () => {
      (Comment.findAll as jest.Mock).mockRejectedValue(new Error("Fetch failed"));
      (apiResponse.errorResponse as jest.Mock).mockReturnValue("ERROR");

      const result = await getCommentsByPost(req, res);

      expect(result).toBe("ERROR");
      expect(apiResponse.errorResponse).toHaveBeenCalledWith(res, "Fetch failed");
    });
  });

  describe("updateComment", () => {
    it("should return not found when the comment is missing", async () => {
      (Comment.findOne as jest.Mock).mockResolvedValue(null);
      (apiResponse.notFoundResponse as jest.Mock).mockReturnValue("NOT_FOUND");

      const result = await updateComment(req, res);

      expect(Comment.findOne).toHaveBeenCalledWith({
        where: {
          comment_id: "20",
          user_id: 1
        }
      });
      expect(result).toBe("NOT_FOUND");
      expect(apiResponse.notFoundResponse).toHaveBeenCalledWith(
        res,
        "Comment not found"
      );
    });

    it("should update a comment successfully", async () => {
      const comment = {
        comment_id: 20,
        text: "Old text",
        update: jest.fn().mockResolvedValue(undefined)
      };

      (Comment.findOne as jest.Mock).mockResolvedValue(comment);
      (apiResponse.successResponse as jest.Mock).mockReturnValue("SUCCESS");

      const result = await updateComment(req, res);

      expect(comment.update).toHaveBeenCalledWith({
        text: "Nice post"
      });
      expect(result).toBe("SUCCESS");
      expect(apiResponse.successResponse).toHaveBeenCalledWith(
        res,
        "Comment updated successfully",
        comment
      );
    });

    it("should handle update errors", async () => {
      (Comment.findOne as jest.Mock).mockRejectedValue(new Error("Update failed"));
      (apiResponse.errorResponse as jest.Mock).mockReturnValue("ERROR");

      const result = await updateComment(req, res);

      expect(result).toBe("ERROR");
      expect(apiResponse.errorResponse).toHaveBeenCalledWith(res, "Update failed");
    });
  });

  describe("deleteComment", () => {
    it("should return not found when deleting a missing comment", async () => {
      (Comment.destroy as jest.Mock).mockResolvedValue(0);
      (apiResponse.notFoundResponse as jest.Mock).mockReturnValue("NOT_FOUND");

      const result = await deleteComment(req, res);

      expect(Comment.destroy).toHaveBeenCalledWith({
        where: {
          comment_id: "20",
          user_id: 1
        }
      });
      expect(result).toBe("NOT_FOUND");
      expect(apiResponse.notFoundResponse).toHaveBeenCalledWith(
        res,
        "Comment not found"
      );
    });

    it("should delete a comment successfully", async () => {
      (Comment.destroy as jest.Mock).mockResolvedValue(1);
      (apiResponse.successResponse as jest.Mock).mockReturnValue("SUCCESS");

      const result = await deleteComment(req, res);

      expect(result).toBe("SUCCESS");
      expect(apiResponse.successResponse).toHaveBeenCalledWith(
        res,
        "Comment deleted successfully"
      );
    });
  });

  describe("getAllComments", () => {
    it("should fetch all comments with related user and post data", async () => {
      const comments = [
        { comment_id: 1, text: "Nice post" }
      ];

      (Comment.findAll as jest.Mock).mockResolvedValue(comments);
      (apiResponse.successResponse as jest.Mock).mockReturnValue("SUCCESS");

      const result = await getAllComments(req, res);

      expect(Comment.findAll).toHaveBeenCalledWith({
        include: [
          {
            model: User,
            attributes: ["user_id", "username"]
          },
          {
            model: Post,
            attributes: ["post_id"],
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
        "All comments fetched successfully",
        comments
      );
    });

    it("should handle get all comments errors", async () => {
      (Comment.findAll as jest.Mock).mockRejectedValue(new Error("DB error"));
      (apiResponse.errorResponse as jest.Mock).mockReturnValue("ERROR");

      const result = await getAllComments(req, res);

      expect(result).toBe("ERROR");
      expect(apiResponse.errorResponse).toHaveBeenCalledWith(res, "DB error");
    });
  });
});

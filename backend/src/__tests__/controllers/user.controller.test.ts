import { Op } from "sequelize";
import { validationResult } from "express-validator";
import {
  deleteUser,
  getMyProfile,
  getUserById,
  getUserFullProfile,
  getUsers,
  login,
  register,
  searchByUsername,
  updateUser
} from "../../controllers/user.controller.js";
import User from "../../models/user.model.js";
import Post from "../../models/post.model.js";
import Follower from "../../models/follower.model.js";
import bcrypt from "bcrypt";
import apiResponse from "../../utils/apiResponse.js";
import jwt from "jsonwebtoken";

jest.mock("../../models/user.model.js");
jest.mock("../../models/post.model.js");
jest.mock("../../models/follower.model.js");
jest.mock("../../models/like.model.js");
jest.mock("../../models/comment.model.js");
jest.mock("bcrypt");
jest.mock("../../utils/apiResponse.js");
jest.mock("jsonwebtoken");
jest.mock("express-validator", () => ({
  validationResult: jest.fn()
}));

const mockedValidationResult = validationResult as unknown as jest.Mock;
const mockedUser = User as jest.Mocked<typeof User>;
const mockedPost = Post as jest.Mocked<typeof Post>;
const mockedFollower = Follower as jest.Mocked<typeof Follower>;
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockedJwt = jwt as jest.Mocked<typeof jwt>;
const mockedApiResponse = apiResponse as jest.Mocked<typeof apiResponse>;

const createMockRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
});

const mockValidationSuccess = () => {
  mockedValidationResult.mockReturnValue({
    isEmpty: () => true,
    array: () => []
  });
};

describe("User Controller - Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
    mockValidationSuccess();
  });

  describe("register", () => {
    let req: any;
    let res: any;

    beforeEach(() => {
      req = {
        body: {
          username: "gowthami",
          email: "test@mail.com",
          password: "123456",
          phone: "1234567890",
          dateofbirth: "2000-01-01",
          gender: "female",
          bio: "hello"
        }
      };
      res = createMockRes();
    });

    it("should fail when validation errors exist", async () => {
      const validationErrors = [{ msg: "Email is required", path: "email" }];

      mockedValidationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => validationErrors
      });
      mockedApiResponse.errorResponse.mockReturnValue("ERROR" as never);

      const result = await register(req, res);

      expect(result).toBe("ERROR");
      expect(mockedApiResponse.errorResponse).toHaveBeenCalledWith(
        res,
        "Validation failed",
        validationErrors,
        400
      );
      expect(mockedUser.findOne).not.toHaveBeenCalled();
    });

    it("should fail when username is already registered", async () => {
      mockedUser.findOne.mockResolvedValueOnce({ user_id: 1 } as any);
      mockedApiResponse.errorResponse.mockReturnValue("ERROR" as never);

      const result = await register(req, res);

      expect(result).toBe("ERROR");
      expect(mockedUser.findOne).toHaveBeenCalledWith({
        where: { username: req.body.username }
      });
      expect(mockedApiResponse.errorResponse).toHaveBeenCalledWith(
        res,
        "Username already registered",
        null,
        400
      );
      expect(mockedBcrypt.hash).not.toHaveBeenCalled();
    });

    it("should fail when email is already registered", async () => {
      mockedUser.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce({ user_id: 2 } as any);
      mockedApiResponse.errorResponse.mockReturnValue("ERROR" as never);

      const result = await register(req, res);

      expect(result).toBe("ERROR");
      expect(mockedUser.findOne).toHaveBeenNthCalledWith(1, {
        where: { username: req.body.username }
      });
      expect(mockedUser.findOne).toHaveBeenNthCalledWith(2, {
        where: { email: req.body.email }
      });
      expect(mockedApiResponse.errorResponse).toHaveBeenCalledWith(
        res,
        "Email already registered",
        null,
        400
      );
    });

    it("should register user successfully", async () => {
      const createdUser = { user_id: 1, ...req.body, password: "hashedPassword" };

      mockedUser.findOne.mockResolvedValue(null);
      mockedBcrypt.hash.mockResolvedValue("hashedPassword" as never);
      mockedUser.create.mockResolvedValue(createdUser as any);
      mockedApiResponse.createdResponse.mockReturnValue("SUCCESS" as never);

      const result = await register(req, res);

      expect(mockedBcrypt.hash).toHaveBeenCalledWith("123456", 10);
      expect(mockedUser.create).toHaveBeenCalledWith({
        username: req.body.username,
        email: req.body.email,
        password: "hashedPassword",
        phone: req.body.phone,
        dateofbirth: req.body.dateofbirth,
        gender: req.body.gender,
        bio: req.body.bio
      });
      expect(result).toBe("SUCCESS");
      expect(mockedApiResponse.createdResponse).toHaveBeenCalledWith(
        res,
        "User registered",
        createdUser
      );
    });

    it("should handle bcrypt hash failure", async () => {
      mockedUser.findOne.mockResolvedValue(null);
      mockedBcrypt.hash.mockRejectedValue(new Error("Hashing failed") as never);
      mockedApiResponse.errorResponse.mockReturnValue("ERROR" as never);

      const result = await register(req, res);

      expect(result).toBe("ERROR");
      expect(mockedApiResponse.errorResponse).toHaveBeenCalledWith(
        res,
        "Hashing failed"
      );
    });

    it("should handle create failure", async () => {
      mockedUser.findOne.mockResolvedValue(null);
      mockedBcrypt.hash.mockResolvedValue("hashedPassword" as never);
      mockedUser.create.mockRejectedValue(new Error("DB error") as never);
      mockedApiResponse.errorResponse.mockReturnValue("ERROR" as never);

      const result = await register(req, res);

      expect(result).toBe("ERROR");
      expect(mockedApiResponse.errorResponse).toHaveBeenCalledWith(res, "DB error");
    });
  });

  describe("login", () => {
    let req: any;
    let res: any;

    beforeEach(() => {
      req = {
        body: {
          email: "test@mail.com",
          password: "123456"
        }
      };
      res = createMockRes();
    });

    it("should return not found when user does not exist", async () => {
      mockedUser.findOne.mockResolvedValue(null);
      mockedApiResponse.notFoundResponse.mockReturnValue("NOT_FOUND" as never);

      const result = await login(req, res);

      expect(mockedUser.findOne).toHaveBeenCalledWith({
        where: { email: req.body.email }
      });
      expect(result).toBe("NOT_FOUND");
      expect(mockedApiResponse.notFoundResponse).toHaveBeenCalledWith(
        res,
        "User not found"
      );
    });

    it("should return unauthorized for invalid password", async () => {
      mockedUser.findOne.mockResolvedValue({
        user_id: 1,
        password: "hashedPassword"
      } as any);
      mockedBcrypt.compare.mockResolvedValue(false as never);
      mockedApiResponse.unauthorizedResponse.mockReturnValue("INVALID" as never);

      const result = await login(req, res);

      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        req.body.password,
        "hashedPassword"
      );
      expect(result).toBe("INVALID");
      expect(mockedApiResponse.unauthorizedResponse).toHaveBeenCalledWith(
        res,
        "Invalid password"
      );
    });

    it("should login successfully", async () => {
      mockedUser.findOne.mockResolvedValue({
        user_id: 1,
        password: "hashedPassword"
      } as any);
      mockedBcrypt.compare.mockResolvedValue(true as never);
      mockedJwt.sign.mockReturnValue("mockToken" as never);
      mockedApiResponse.successResponse.mockReturnValue("SUCCESS" as never);

      const result = await login(req, res);

      expect(mockedJwt.sign).toHaveBeenCalledWith(
        { user_id: 1 },
        "test-secret",
        { expiresIn: "1d" }
      );
      expect(result).toBe("SUCCESS");
      expect(mockedApiResponse.successResponse).toHaveBeenCalledWith(
        res,
        "Login successful",
        { token: "mockToken" }
      );
    });

    it("should handle unexpected login errors", async () => {
      mockedUser.findOne.mockRejectedValue(new Error("DB error") as never);
      mockedApiResponse.errorResponse.mockReturnValue("ERROR" as never);

      const result = await login(req, res);

      expect(result).toBe("ERROR");
      expect(mockedApiResponse.errorResponse).toHaveBeenCalledWith(res, "DB error");
    });
  });

  describe("getUsers", () => {
    let req: any;
    let res: any;

    beforeEach(() => {
      req = {};
      res = createMockRes();
    });

    it("should fetch users successfully", async () => {
      const users = [{ user_id: 1, username: "gowthami" }];

      mockedUser.findAll.mockResolvedValue(users as any);
      mockedApiResponse.successResponse.mockReturnValue("SUCCESS" as never);

      const result = await getUsers(req, res);

      expect(mockedUser.findAll).toHaveBeenCalledWith({
        attributes: { exclude: ["password"] }
      });
      expect(result).toBe("SUCCESS");
      expect(mockedApiResponse.successResponse).toHaveBeenCalledWith(
        res,
        "Users fetched",
        users
      );
    });

    it("should return an empty array when no users exist", async () => {
      mockedUser.findAll.mockResolvedValue([] as any);
      mockedApiResponse.successResponse.mockReturnValue("SUCCESS" as never);

      const result = await getUsers(req, res);

      expect(result).toBe("SUCCESS");
      expect(mockedApiResponse.successResponse).toHaveBeenCalledWith(
        res,
        "Users fetched",
        []
      );
    });

    it("should handle get users errors", async () => {
      mockedUser.findAll.mockRejectedValue(new Error("DB error") as never);
      mockedApiResponse.errorResponse.mockReturnValue("ERROR" as never);

      const result = await getUsers(req, res);

      expect(result).toBe("ERROR");
      expect(mockedApiResponse.errorResponse).toHaveBeenCalledWith(res, "DB error");
    });
  });

  describe("getUserById", () => {
    let req: any;
    let res: any;

    beforeEach(() => {
      req = { params: { id: "1" } };
      res = createMockRes();
    });

    it("should fetch a user by id", async () => {
      const user = { user_id: 1, username: "gowthami" };

      mockedUser.findByPk.mockResolvedValue(user as any);
      mockedApiResponse.successResponse.mockReturnValue("SUCCESS" as never);

      const result = await getUserById(req, res);

      expect(mockedUser.findByPk).toHaveBeenCalledWith("1", {
        attributes: { exclude: ["password"] }
      });
      expect(result).toBe("SUCCESS");
      expect(mockedApiResponse.successResponse).toHaveBeenCalledWith(
        res,
        "User fetched",
        user
      );
    });

    it("should support array params by using the first value", async () => {
      req.params.id = ["9", "10"];
      mockedUser.findByPk.mockResolvedValue({ user_id: 9 } as any);
      mockedApiResponse.successResponse.mockReturnValue("SUCCESS" as never);

      await getUserById(req, res);

      expect(mockedUser.findByPk).toHaveBeenCalledWith("9", {
        attributes: { exclude: ["password"] }
      });
    });

    it("should return not found when user is missing", async () => {
      mockedUser.findByPk.mockResolvedValue(null);
      mockedApiResponse.notFoundResponse.mockReturnValue("NOT_FOUND" as never);

      const result = await getUserById(req, res);

      expect(result).toBe("NOT_FOUND");
      expect(mockedApiResponse.notFoundResponse).toHaveBeenCalledWith(
        res,
        "User not found"
      );
    });

    it("should handle get user by id errors", async () => {
      mockedUser.findByPk.mockRejectedValue(new Error("DB error") as never);
      mockedApiResponse.errorResponse.mockReturnValue("ERROR" as never);

      const result = await getUserById(req, res);

      expect(result).toBe("ERROR");
      expect(mockedApiResponse.errorResponse).toHaveBeenCalledWith(res, "DB error");
    });
  });

  describe("updateUser", () => {
    let req: any;
    let res: any;

    beforeEach(() => {
      req = {
        params: { id: "1" },
        body: { bio: "updated bio" }
      };
      res = createMockRes();
    });

    it("should update a user successfully", async () => {
      mockedUser.update.mockResolvedValue([1] as any);
      mockedApiResponse.successResponse.mockReturnValue("SUCCESS" as never);

      const result = await updateUser(req, res);

      expect(mockedUser.update).toHaveBeenCalledWith(req.body, {
        where: { user_id: "1" }
      });
      expect(result).toBe("SUCCESS");
      expect(mockedApiResponse.successResponse).toHaveBeenCalledWith(
        res,
        "User updated successfully"
      );
    });

    it("should return not found when no user is updated", async () => {
      mockedUser.update.mockResolvedValue([0] as any);
      mockedApiResponse.notFoundResponse.mockReturnValue("NOT_FOUND" as never);

      const result = await updateUser(req, res);

      expect(result).toBe("NOT_FOUND");
      expect(mockedApiResponse.notFoundResponse).toHaveBeenCalledWith(
        res,
        "User not found"
      );
    });

    it("should handle update errors", async () => {
      mockedUser.update.mockRejectedValue(new Error("DB error") as never);
      mockedApiResponse.errorResponse.mockReturnValue("ERROR" as never);

      const result = await updateUser(req, res);

      expect(result).toBe("ERROR");
      expect(mockedApiResponse.errorResponse).toHaveBeenCalledWith(res, "DB error");
    });
  });

  describe("deleteUser", () => {
    let req: any;
    let res: any;

    beforeEach(() => {
      req = { params: { id: "1" } };
      res = createMockRes();
    });

    it("should delete a user successfully", async () => {
      mockedUser.destroy.mockResolvedValue(1 as never);
      mockedApiResponse.successResponse.mockReturnValue("SUCCESS" as never);

      const result = await deleteUser(req, res);

      expect(mockedUser.destroy).toHaveBeenCalledWith({
        where: { user_id: "1" }
      });
      expect(result).toBe("SUCCESS");
      expect(mockedApiResponse.successResponse).toHaveBeenCalledWith(
        res,
        "User deleted successfully"
      );
    });

    it("should return not found when no user is deleted", async () => {
      mockedUser.destroy.mockResolvedValue(0 as never);
      mockedApiResponse.notFoundResponse.mockReturnValue("NOT_FOUND" as never);

      const result = await deleteUser(req, res);

      expect(result).toBe("NOT_FOUND");
      expect(mockedApiResponse.notFoundResponse).toHaveBeenCalledWith(
        res,
        "User not found"
      );
    });

    it("should handle delete errors", async () => {
      mockedUser.destroy.mockRejectedValue(new Error("DB error") as never);
      mockedApiResponse.errorResponse.mockReturnValue("ERROR" as never);

      const result = await deleteUser(req, res);

      expect(result).toBe("ERROR");
      expect(mockedApiResponse.errorResponse).toHaveBeenCalledWith(res, "DB error");
    });
  });

  describe("getMyProfile", () => {
    let req: any;
    let res: any;

    beforeEach(() => {
      req = { user: { user_id: 1 } };
      res = createMockRes();
    });

    it("should fetch the authenticated user's profile", async () => {
      const profile = { user_id: 1, username: "gowthami" };

      mockedUser.findByPk.mockResolvedValue(profile as any);
      mockedApiResponse.successResponse.mockReturnValue("SUCCESS" as never);

      const result = await getMyProfile(req, res);

      expect(mockedUser.findByPk).toHaveBeenCalledWith(1, {
        attributes: { exclude: ["password"] }
      });
      expect(result).toBe("SUCCESS");
      expect(mockedApiResponse.successResponse).toHaveBeenCalledWith(
        res,
        "Profile fetched",
        profile
      );
    });

    it("should return not found when the authenticated user does not exist", async () => {
      mockedUser.findByPk.mockResolvedValue(null);
      mockedApiResponse.notFoundResponse.mockReturnValue("NOT_FOUND" as never);

      const result = await getMyProfile(req, res);

      expect(result).toBe("NOT_FOUND");
      expect(mockedApiResponse.notFoundResponse).toHaveBeenCalledWith(
        res,
        "User not found"
      );
    });

    it("should handle profile fetch errors", async () => {
      mockedUser.findByPk.mockRejectedValue(new Error("DB error") as never);
      mockedApiResponse.errorResponse.mockReturnValue("ERROR" as never);

      const result = await getMyProfile(req, res);

      expect(result).toBe("ERROR");
      expect(mockedApiResponse.errorResponse).toHaveBeenCalledWith(res, "DB error");
    });
  });

  describe("getUserFullProfile", () => {
    let req: any;
    let res: any;

    beforeEach(() => {
      req = { params: { userId: "5" } };
      res = createMockRes();
    });

    it("should fetch the user full profile with related includes", async () => {
      const profile = { user_id: 5, username: "gowthami" };

      mockedUser.findByPk.mockResolvedValue(profile as any);
      mockedApiResponse.successResponse.mockReturnValue("SUCCESS" as never);

      const result = await getUserFullProfile(req, res);

      expect(mockedUser.findByPk).toHaveBeenCalledWith(
        "5",
        expect.objectContaining({
          attributes: ["user_id", "username", "email"],
          include: expect.arrayContaining([
            expect.objectContaining({
              model: mockedPost,
              attributes: ["post_id", "media_url", "caption", "createdAt"]
            }),
            expect.objectContaining({
              model: mockedFollower,
              as: "Followers"
            }),
            expect.objectContaining({
              model: mockedFollower,
              as: "Following"
            })
          ])
        })
      );
      expect(result).toBe("SUCCESS");
      expect(mockedApiResponse.successResponse).toHaveBeenCalledWith(
        res,
        "User full profile fetched",
        profile
      );
    });

    it("should return not found when the full profile user does not exist", async () => {
      mockedUser.findByPk.mockResolvedValue(null);
      mockedApiResponse.notFoundResponse.mockReturnValue("NOT_FOUND" as never);

      const result = await getUserFullProfile(req, res);

      expect(result).toBe("NOT_FOUND");
      expect(mockedApiResponse.notFoundResponse).toHaveBeenCalledWith(
        res,
        "User not found"
      );
    });

    it("should handle full profile errors", async () => {
      mockedUser.findByPk.mockRejectedValue(new Error("DB error") as never);
      mockedApiResponse.errorResponse.mockReturnValue("ERROR" as never);

      const result = await getUserFullProfile(req, res);

      expect(result).toBe("ERROR");
      expect(mockedApiResponse.errorResponse).toHaveBeenCalledWith(res, "DB error");
    });
  });

  describe("searchByUsername", () => {
    let req: any;
    let res: any;

    beforeEach(() => {
      req = { query: { username: "gow" } };
      res = createMockRes();
    });

    it("should return an error when username query is missing", async () => {
      req.query = {};
      mockedApiResponse.errorResponse.mockReturnValue("ERROR" as never);

      const result = await searchByUsername(req, res);

      expect(result).toBe("ERROR");
      expect(mockedApiResponse.errorResponse).toHaveBeenCalledWith(
        res,
        "Username query parameter is required"
      );
      expect(mockedUser.findAll).not.toHaveBeenCalled();
    });

    it("should search users by username pattern", async () => {
      const users = [{ user_id: 1, username: "gowthami" }];

      mockedUser.findAll.mockResolvedValue(users as any);
      mockedApiResponse.successResponse.mockReturnValue("SUCCESS" as never);

      const result = await searchByUsername(req, res);

      expect(mockedUser.findAll).toHaveBeenCalledWith({
        where: {
          username: {
            [Op.like]: "%gow%"
          }
        },
        attributes: { exclude: ["password"] }
      });
      expect(result).toBe("SUCCESS");
      expect(mockedApiResponse.successResponse).toHaveBeenCalledWith(
        res,
        "Users fetched successfully",
        users
      );
    });

    it("should handle search errors", async () => {
      mockedUser.findAll.mockRejectedValue(new Error("DB error") as never);
      mockedApiResponse.errorResponse.mockReturnValue("ERROR" as never);

      const result = await searchByUsername(req, res);

      expect(result).toBe("ERROR");
      expect(mockedApiResponse.errorResponse).toHaveBeenCalledWith(res, "DB error");
    });
  });
});

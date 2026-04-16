import { Router, RequestHandler } from "express";
import auth from "../middlewares/auth.middleware.js";
import * as followerController from "../controllers/follower.controller.js";

const router = Router();

// 🔥 STATIC ROUTES FIRST
router.get(
  "/chat-users",
  auth,
  followerController.getChatUsers as RequestHandler
);

router.delete(
  "/remove/:userId",
  auth,
  followerController.removeFollower as RequestHandler
);

// 🔥 THEN DYNAMIC ROUTES
router.post(
  "/:userId",
  auth,
  followerController.followUser as RequestHandler
);

router.delete(
  "/:userId",
  auth,
  followerController.unfollowUser as RequestHandler
);

router.get(
  "/:userId/followers",
  auth,
  followerController.getFollowers as RequestHandler
);

router.get(
  "/:userId/following",
  auth,
  followerController.getFollowing as RequestHandler
);

export default router;
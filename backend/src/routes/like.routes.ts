import { Router, RequestHandler } from "express";
import auth from "../middlewares/auth.middleware.js";
import * as likeController from "../controllers/like.controller.js";

const router = Router();

router.post("/:postId", auth, likeController.likePost as RequestHandler);
router.delete("/:postId", auth, likeController.unlikePost as RequestHandler);
router.get("/", auth, likeController.getAllLikes as RequestHandler);
router.get("/post/:postId", auth, likeController.getLikesByPost as RequestHandler);

export default router;
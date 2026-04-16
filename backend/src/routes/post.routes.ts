import { Router } from "express";
import auth from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import * as postController from "../controllers/post.controller.js";
import { createPostValidation, updatePostValidation } from "../validations/post.validation.js";

const router = Router();

router.post(
  "/",
  auth,
   upload.array("media"),
  createPostValidation,
  validate,
  postController.createPost as any
);

router.get("/me", auth, postController.getMyPosts as any);

router.get("/", postController.getAllPosts);

router.put(
  "/:postId",
  auth,
  updatePostValidation,
  validate,
  postController.updatePost as any
);

router.delete("/:postId", auth, postController.deletePost as any);

export default router;
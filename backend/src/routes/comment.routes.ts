import { Router } from "express";
import auth from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import * as commentController from "../controllers/comment.controller.js";
import { createCommentValidation, updateCommentValidation } from "../validations/comment.validation.js";

const router: Router = Router();

router.post("/:postId", auth, createCommentValidation, validate, commentController.addComment);

router.get("/post/:postId", auth, commentController.getCommentsByPost);

router.put("/:commentId", auth, updateCommentValidation, validate, commentController.updateComment);

router.delete("/:commentId", auth, commentController.deleteComment);

router.get("/", auth, commentController.getAllComments);

export default router;
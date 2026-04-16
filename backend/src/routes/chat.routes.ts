import { Router } from "express";
import auth from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import * as chatController from "../controllers/chat.controller.js";
import {
  sendMessageValidation,
  updateMessageValidation
} from "../validations/chat.validation.js";

const router: Router = Router();

router.post(
  "/:receiverId",
  auth,
  sendMessageValidation,
  validate,
  chatController.sendMessage
);

router.get(
  "/:userId",
  auth,
  chatController.getChats
);

router.put(
  "/:messageId",
  auth,
  updateMessageValidation,
  validate,
  chatController.updateMessage
);

router.delete(
  "/:messageId",
  auth,
  chatController.deleteMessage
);

export default router;
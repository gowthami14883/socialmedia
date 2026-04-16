import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import auth from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { registerValidation, loginValidation, updateUserValidation } from "../validations/user.validation.js";

const router = Router();

router.post("/register", registerValidation,validate, userController.register);
router.post("/login", loginValidation, validate, userController.login);
router.get("/me", auth, userController.getMyProfile);

router.get("/search", auth, userController.searchByUsername);
router.get("/", userController.getUsers);
router.get("/:id", auth, userController.getUserById);
router.put("/:id", auth, updateUserValidation, validate, userController.updateUser);
router.delete("/:id", auth, userController.deleteUser);
router.get("/:userId/profile", auth, userController.getUserFullProfile);

export default router;
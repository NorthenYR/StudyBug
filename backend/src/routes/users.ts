import express from "express";
import * as UserController from "../controllers/users"
import { requiresAuth } from "../middleware/auth";

const router = express.Router();
router.get("/", requiresAuth, UserController.getAuthUser)
router.get("/", UserController.getAuthUser)
router.post("/signup", UserController.signUp)
router.post("/login", UserController.login)
router.post("/logout", UserController.logout)
router.patch("/:userId", UserController.updateUser)

export default router; 
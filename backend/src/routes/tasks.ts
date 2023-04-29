/* A module for routing of endpoints(URIs) on the task pages of the website. */
import express from "express";
import * as TaskController from "../controllers/tasks";

const router = express.Router();

router.get("/", TaskController.getTasks);
router.post("/", TaskController.createTask);
router.get("/:taskId", TaskController.getTask);
router.patch("/:taskId", TaskController.updateTask);
router.delete("/:taskId", TaskController.deleteTask);
export default router;

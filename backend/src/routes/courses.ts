/* A module for routing of endpoints(URIs) on the course pages of the website. */
import express from "express";
import * as CourseController from "../controllers/courses";

const router = express.Router();

router.get("/", CourseController.getCourses);
router.post("/", CourseController.createCourse);
router.get("/:courseId", CourseController.getCourse);
router.patch("/:courseId", CourseController.updateCourse);
router.delete("/:courseId", CourseController.deleteCourse);
router.get("/:courseId/tasks", CourseController.getAllCourseTasks);
export default router;

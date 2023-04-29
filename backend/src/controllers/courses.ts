/* A module of all handler functions for CRUD operations on courses data. */
import { notEqual } from "assert";
import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import courseModel from "../models/models";
import taskModel from "../models/task";
import taskSchema, { Task } from "../models/task";
import { assertIsDefined } from "../util/assertIsDefined";

export const getCourses: RequestHandler = async (req, res, next) => {
  const authUserId = req.session.userId;

  try {
    assertIsDefined(authUserId);
    const courses = await courseModel.find({ userId: authUserId }).exec();
    res.status(200).json(courses);
  } catch (error) {
    next(error);
  }
};

export const getCourse: RequestHandler = async (req, res, next) => {
  const courseId = req.params.courseId;
  const authUserId = req.session.userId;

  try {
    assertIsDefined(authUserId);

    if (!mongoose.isValidObjectId(courseId)) {
      throw createHttpError(400, "invalid course id :(");
    }
    const course = await courseModel.findById(courseId).exec();
    res.status(200).json(course);

    if (!course) {
      throw createHttpError(404, "course not found :(");
    }
    if (!course.userId.equals(authUserId)) {
      throw createHttpError(401, "you cannot access this note :(");
    }
  } catch (error) {
    next(error);
  }
};

interface CreateCourseBody {
  name?: string;
  code?: string;
  prof?: { prof_name: string; prof_email: string };
  ta?: { ta_name: string; ta_email: string };
  color?: string;
  tasks?: Task[];
}

export const createCourse: RequestHandler<
  unknown,
  unknown,
  CreateCourseBody,
  unknown
> = async (req, res, next) => {
  const name = req.body.name;
  const code = req.body.code;
  const prof = req.body.prof;
  const ta = req.body.ta;
  const color = req.body.color;
  const tasks = req.body.tasks;
  const authUserId = req.session.userId;

  try {
    assertIsDefined(authUserId);
    if (!name) {
      throw createHttpError(400, "Course must have a name");
    }

    const newCourse = await courseModel.create({
      userId: authUserId,
      name: name,
      code: code,
      prof: prof,
      ta: ta,
      color: color,
      tasks: tasks,
    });

    res.status(201).json(newCourse);
  } catch (error) {
    next(error);
  }
};

interface UpdateCourseParams {
  courseId: string;
}

// wait should these all be optional? including the other interface?
interface UpdateCourseBody {
  name?: string;
  code?: string;
  prof?: { prof_name: string; prof_email: string };
  ta?: [{ ta_name: string; ta_email: string }];
  color?: string;
  // tasks?: Task[];
  tasks?: any[];
}

export const updateCourse: RequestHandler<
  UpdateCourseParams,
  unknown,
  UpdateCourseBody,
  unknown
> = async (req, res, next) => {
  const courseId = req.params.courseId;
  const newName = req.body.name;
  const newCode = req.body.code;
  const newProf = req.body.prof;
  const newTA = req.body.ta || [];
  const newColor = req.body.color;
  const newTasks = req.body.tasks || [];
  const authUserId = req.session.userId;

  try {
    assertIsDefined(authUserId);
    if (!mongoose.isValidObjectId(courseId)) {
      throw createHttpError(400, "invalid course id :(");
    }

    if (!newName || !newCode || !newProf || !newColor || !newTasks || !newTA) {
      throw createHttpError(400, "Missing course value");
    }
    const course = await courseModel.findById(courseId).exec();

    if (!course) {
      throw createHttpError(404, "course not found :(");
    }

    if (!course.userId.equals(authUserId)) {
      throw createHttpError(401, "you cannot access this course :(");
    }

    course.name = newName;
    course.code = newCode;
    course.prof = newProf;
    course.ta = newTA;
    course.color = newColor;
    course.tasks = newTasks;

    const updatedCourse = await course.save();

    res.status(200).json(updatedCourse);
  } catch (error) {
    console.log("err: ", error);
    next(error);
  }
};

export const deleteCourse: RequestHandler = async (req, res, next) => {
  const courseId = req.params.courseId;
  const authUserId = req.session.userId;

  try {
    assertIsDefined(authUserId);
    if (!mongoose.isValidObjectId(courseId)) {
      throw createHttpError(400, "invalid course id :(");
    }

    const course = await courseModel.findById(courseId).exec();

    if (!course) {
      throw createHttpError(404, "course not found :(");
    }

    if (!course.userId.equals(authUserId)) {
      throw createHttpError(401, "you cannot access this note :(");
    }

    await course.remove();

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export const getAllCourseTasks: RequestHandler = async (req, res, next) => {
  const courseId = req.params.courseId;
  const authUserId = req.session.userId;
  try {
    assertIsDefined(authUserId);

    if (!mongoose.isValidObjectId(courseId)) {
      throw createHttpError(400, "invalid course id :(");
    }

    const courseTasks = await taskModel.find({ course: req.params.courseId });

    if (!courseTasks) {
      throw createHttpError(404, "courseTasks not found :(");
    }

    //TODO: uh come back to this idk what it should be
    // if (!course.userId.equals(authUserId)) {
    //   throw createHttpError(401, "you cannot access this course :(");
    // }


    res.status(200).json(courseTasks)
  } catch (error) {
    console.log("error in getAllCourseTasks controller");
    next(error);
  }
};

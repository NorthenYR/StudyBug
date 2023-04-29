/* A module of all handler functions for CRUD operations on tasks data. */
import { notEqual } from "assert";
import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { Course } from "../models/models";
import taskModel from "../models/task";
import taskSchema, { Task } from "../models/task";
import { assertIsDefined } from "../util/assertIsDefined";
import { Dayjs } from "dayjs";
import task from "../models/task";

export const getTasks: RequestHandler = async (req, res, next) => {
  const authUserId = req.session.userId;

  try {
    assertIsDefined(authUserId);
    const tasks = await taskModel.find({ userId: authUserId }).exec();
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

export const getTask: RequestHandler = async (req, res, next) => {
  const taskId = req.params.taskId;
  const authUserId = req.session.userId;

  try {
    assertIsDefined(authUserId);

    if (!mongoose.isValidObjectId(taskId)) {
      throw createHttpError(400, "invalid task id :(");
    }
    const task = await taskModel.findById(taskId).exec();
    res.status(200).json(task);

    if (!task) {
      throw createHttpError(404, "task not found :(");
    }
    if (!task.userId.equals(authUserId)) {
      throw createHttpError(401, "you cannot access this task :(");
    }
  } catch (error) {
    next(error);
  }
};

interface CreateTaskBody {
  courseId?: mongoose.Types.ObjectId;
  course?: Course;
  name?: string;
  start_date?: Date | Dayjs | string;
  end_date?: Date | Dayjs | string;
  priority?: string;
  tags?: string[];
  notes?: string;
  completed?: boolean;
  weight?: number;
  earned?: number;
  variety?: string;
}

export const createTask: RequestHandler<
  unknown,
  unknown,
  CreateTaskBody,
  unknown
> = async (req, res, next) => {
  const name = req.body.name;
  const start_date = req.body.start_date;
  const end_date = req.body.end_date;
  const priority = req.body.priority;
  const tags = req.body.tags;
  const notes = req.body.notes;
  const completed = req.body.completed;
  const weight = req.body.weight;
  const earned = req.body.earned;
  const variety = req.body.variety;
  const authUserId = req.session.userId;
  const courseId = req.body.courseId;
  const course = req.body.course;

  try {
    assertIsDefined(authUserId);
    if (!name) {
      throw createHttpError(400, "Task must have a name");
    }

    const newTask = await taskModel.create({
      userId: authUserId,
      courseId: courseId,
      course: course,
      name: name,
      start_date: start_date,
      end_date: end_date,
      priority: priority,
      tags: tags,
      notes: notes,
      completed: completed,
      weight: weight,
      earned: earned,
      variety: variety,
    });

    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
};

interface UpdateTaskParams {
  taskId: string;
}

interface UpdateTaskBody {
  name?: string;
  start_date?: Date | Dayjs | string;
  end_date?: Date | Dayjs | string;
  priority?: string;
  tags?: string[];
  notes?: string;
  completed?: boolean;
  weight?: number;
  earned?: number;
  variety?: string;
}

export const updateTask: RequestHandler<
  UpdateTaskParams,
  unknown,
  UpdateTaskBody,
  unknown
> = async (req, res, next) => {
  const taskId = req.params.taskId;
  const newName = req.body.name;
  const newStartDate = req.body.start_date;
  const newEndDate = req.body.end_date;
  const newPriority = req.body.priority;
  const newTags = req.body.tags;
  const newNotes = req.body.notes;
  const newCompleted = req.body.completed;
  const newWeight = req.body.weight;
  const newEarned = req.body.earned;
  const newVariety = req.body.variety;
  const authUserId = req.session.userId;

  try {
    assertIsDefined(authUserId);
    if (!mongoose.isValidObjectId(taskId)) {
      throw createHttpError(400, "invalid task id :(");
    }


    const task = await taskModel.findById(taskId).exec();

    // cant get this to work in postman for some reason
    if (!task) {
      throw createHttpError(404, "task not found :(");
    }

    if (!task.userId.equals(authUserId)) {
      throw createHttpError(401, "you cannot access this task :(");
    }

    task.name = newName || task.name;
    task.start_date = newStartDate;
    task.end_date = newEndDate;
    task.priority = newPriority;
    task.tags = newTags;
    task.notes = newNotes;
    if (typeof newCompleted === 'boolean') {
      task.completed = newCompleted
    }
    task.weight = newWeight || task.weight;
    task.earned = newEarned;
    task.variety = newVariety;

    const updatedTask = await task.save();

    res.status(200).json(updatedTask);
  } catch (error) {
    console.log("err: ", error);
    next(error);
  }
};

export const deleteTask: RequestHandler = async (req, res, next) => {
  const taskId = req.params.taskId;

  const authUserId = req.session.userId;

  try {
    assertIsDefined(authUserId);
    if (!mongoose.isValidObjectId(taskId)) {
      throw createHttpError(400, "invalid task id :(");
    }

    const task = await taskModel.findById(taskId).exec();

    if (!task) {
      throw createHttpError(404, "task not found :(");
    }

    if (!task.userId.equals(authUserId)) {
      throw createHttpError(401, "you cannot access this task :(");
    }

    await task.remove();

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

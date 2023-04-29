/* A module of all handler functions for CRUD operations on users data. */
import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { assertIsDefined } from "../util/assertIsDefined";
import TaskModel from "../models/task";
import { compareArrays } from "../util/utils";

export const getAuthUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.session.userId)
      .select("+email")
      .exec();
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

interface SignUpBody {
  username?: string;
  email?: string;
  password?: string;
}

export const signUp: RequestHandler<
  unknown,
  unknown,
  SignUpBody,
  unknown
> = async (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const passwordRaw = req.body.password;

  try {
    if (!username || !email || !passwordRaw) {
      throw createHttpError(400, "missing info");
    }

    const usedUsername = await UserModel.findOne({ username: username }).exec();

    if (usedUsername) {
      throw createHttpError(
        409,
        "🐛: username already in use, please choose another"
      );
    }

    const usedEmail = await UserModel.findOne({ email: email }).exec();

    if (usedEmail) {
      throw createHttpError(
        409,
        "🐛: email already in use, please use another"
      );
    }

    const hashPassword = await bcrypt.hash(passwordRaw, 10);

    const newUser = await UserModel.create({
      username: username,
      email: email,
      password: hashPassword,
      allTags: ["aqours"],
      tasks: [],
      courses: [],
    });

    req.session.userId = newUser._id;

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

interface LoginBody {
  username?: string;
  password?: string;
}

export const login: RequestHandler<
  unknown,
  unknown,
  LoginBody,
  unknown
> = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    if (!username || !password) {
      throw createHttpError(400, "inputs missing");
    }

    const user = await UserModel.findOne({ username: username })
      .select("+password +email")
      .exec();

    if (!user) {
      throw createHttpError(401, "invalid credentials");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw createHttpError(401, "invalid credentials");
    }

    req.session.userId = user._id;
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      next(error);
    } else {
      res.sendStatus(200);
    }
  });
};

interface UpdateUserParams {
  userId: string;
}

interface UpdateUserBody {
  username?: string;
  email?: string;
  password?: string;
  // courses?: string;
  // tasks?: string;
  allTags?: string[];
}

// use below if requiresAuth in route:
// export const updateUser: RequestHandler = async (req, res, next) => {

export const updateUser: RequestHandler<
  UpdateUserParams,
  unknown,
  UpdateUserBody,
  unknown
> = async (req, res, next) => {
  const userId = req.params.userId;
  const newUsername = req.body.username;
  const newEmail = req.body.email;
  // skipping password for now
  const newAllTags = req.body.allTags;
  const authUserId = req.session.userId;

  try {
    assertIsDefined(authUserId);
    if (!mongoose.isValidObjectId(userId)) {
      throw createHttpError(400, "invalid user id :(");
    }

    if (!newUsername || !newEmail || !newAllTags) {
      throw createHttpError(400, "Missing course value");
    }

    const user = await UserModel.findById(userId).exec();

    if (!user) {
      throw createHttpError(404, "course not found :(");
    }

    let updatedTags;
    if (user.allTags) {
      updatedTags = compareArrays(user.allTags, newAllTags);
    }

    let newTagName;
    let oldTagName;
    if (typeof updatedTags === "object") {
      newTagName = updatedTags.newVal;
      oldTagName = updatedTags.oldVal;

      console.log("new tag name: ", newTagName);
      console.log("old tag name: ", oldTagName);
      await TaskModel.updateMany(
        { userId: userId, tags: oldTagName },
        { $set: { "tags.$": newTagName } }
      );
    }

    // double check on this later
    // if (!user.userId.equals(authUserId)) {
    //   throw createHttpError(401, "you cannot access this course :(");
    // }

    user.username = newUsername;
    user.email = newEmail;
    user.allTags = newAllTags;

    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("err updating user: ", error);
    next(error);
  }
};

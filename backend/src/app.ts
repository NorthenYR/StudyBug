/* A module that creates a Express application the backend of the web application. */
import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import createHttpError, { isHttpError } from "http-errors";
import coursesRoutes from "./routes/courses";
import tasksRoutes from "./routes/tasks";
import userRoutes from "./routes/users";
import session from "express-session";
import env from "./util/validateEnv";
import MongoStore from "connect-mongo";
import { requiresAuth } from "./middleware/auth";

const app = express();
app.use(express.json());

app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    cookie: {
      // stay signed in for 1 hour of no activity
      maxAge: 60 * 60 * 1000,
      // stay signed in for 10 seconds of no activity
      // maxAge: 10 * 1000,
    },
    rolling: true,
    store: MongoStore.create({
      mongoUrl: env.MONGO_CONNECT,
    }),
  })
);

app.use("/api/users", userRoutes);
app.use("/api/courses/", requiresAuth, coursesRoutes);
app.use("/api/tasks/", requiresAuth, tasksRoutes);

app.use((req, res, next) => {
  next(createHttpError(404, "endpt not found"));
});

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  let errmsg = "unknown err :(";
  let statuscode = 500;
  if (isHttpError(error)) {
    statuscode = error.status;
    errmsg = error.message;
  }
  res.status(statuscode).json({ err: errmsg });
});

export default app;

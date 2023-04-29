/* A module that connects to MongoDB database and sets up the server for the backend of the web application. */
import app from "./app";
import env from "./util/validateEnv";
import mongoose from "mongoose";

const port = env.PORT;

mongoose
  .connect(env.MONGO_CONNECT)
  .then(() => {
    console.log("mongoose connected!!");

    app.listen(port, () => {
      console.log("server running on port: " + port);
    });
  })
  .catch((err) => {
    console.log(err);
  });
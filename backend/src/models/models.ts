/* The schema for MongoDB docuements(records) of course entities. */
// schema
import mongoose, { Schema, InferSchemaType } from "mongoose";
// import { Course, Task, User } from "./types";
// import { Course, Task} from "./"
import task, { taskSchema } from "./task";

// TODO: change the name of this file to course

// COURSE
const courseSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    code: { type: String, required: true },
    prof: {
      type: {
        prof_name: String,
        prof_email: String,
      },
      required: false,
    },
    ta: {
      type: [
        {
          ta_name: String,
          ta_email: String,
        },
      ],
      required: false,
    },
    color: { type: String, required: true },
    tasks: [{ type: Schema.Types.ObjectId, ref: "Tasks" }],
  },
  { timestamps: true }
);

courseSchema.pre("save", async function () {
  const course = this;

  // TODO: purposfully setting tasks as blank here, revaluate later
  await task.updateMany(
    { course: course._id },
    {
      $set: {
        courseName: course.name,
        courseCode: course.code,
        courseProf: course.prof,
        courseTA: course.ta,
        courseColor: course.color,
        courseTasks: [],
      },
    }
  );
});

export type Course = InferSchemaType<typeof courseSchema>;

export default mongoose.model<Course>("Course", courseSchema);

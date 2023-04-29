/* The schema for MongoDB docuements(records) of task entities. */
import mongoose, { Schema, InferSchemaType, model } from "mongoose";

export const taskSchema = new Schema(
  {
    // courseId: { type: Schema.Types.ObjectId, required: false },
    userId: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    start_date: { type: Schema.Types.Mixed, required: false },
    end_date: { type: Schema.Types.Mixed, required: true },
    priority: { type: String, required: false },
    completed: { type: Boolean, required: true },
    notes: {type: String, required: false},
    tags: {type: [String], required: false},
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: false,
    },
    weight: { type: Number, required: true },
    earned: { type: Number, required: false },
    variety: { type: String, required: false },
  },
  { timestamps: true }
);
export type Task = InferSchemaType<typeof taskSchema>;

export default model<Task>("Task", taskSchema);

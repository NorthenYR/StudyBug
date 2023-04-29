/* A module for routing of endpoints(URIs) on the user authentication pages of the website. */
import { InferSchemaType, Schema, model } from "mongoose";

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, select: false },
  password: { type: String, required: true, select: false },
  courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
  tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
  allTags: {type: [String], required: false}
});

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);

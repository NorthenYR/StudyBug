import {Task, Course} from "../models/course"

export interface User {
    _id: string,
    username: string,
    email: string,
    allTags: string[],
    tasks: Task[],
    courses: Course[],
}


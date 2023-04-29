import { ConflictError, UnAuthError } from "../errors/httpsErrors";
import { Course, Task } from "../models/course";
import { User } from "../models/user";

async function fetchData(input: RequestInfo, init?: RequestInit) {
  // console.log("inside fetchData course_api, we are passing: ");
  // console.log("init: ", init);
  // console.log("input: ", input);
  const response = await fetch(input, init);

  if (response.ok) {
    // console.log("in fetch data okay, res is: ", response);
    return response;
  } else {
    const errorBody = await response.json();
    const errorMessage = errorBody.err;
    if (response.status === 401) {
      throw new UnAuthError(errorMessage);
    } else if (response.status === 409) {
      throw new ConflictError(errorMessage);
    } else {
      throw Error(
        "req failed w status: " + response.status + "msg: " + errorMessage
      );
    }
  }
}

export async function getLoggedInUser(): Promise<User> {
  const response = await fetchData("/api/users", { method: "GET" });
  return response.json();
}

export interface SignUpCredentials {
  username: string;
  email: string;
  password: string;
}

export async function signUp(credentials: SignUpCredentials): Promise<User> {
  const response = await fetchData("/api/users/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  return response.json();
}

// not sure if this is a dupe
export interface UserInput {
  username: string;
  email: string;
  allTags: string[];
}

export async function updateUser(
  userId: string,
  user: UserInput
): Promise<User> {
  console.log("updating user: ", user);

  const response = await fetchData("/api/users/" + userId, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  return response.json();
}



export interface LoginCredentials {
  username: string;
  password: string;
}

export async function login(credentials: LoginCredentials): Promise<User> {
  const response = await fetchData("/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const r = response.json();

  return r;
}

export interface SignUpCredentials {
  username: string;
  email: string;
  password: string;
}

export async function logout() {
  await fetchData("/api/users/logout", {
    method: "POST",
  });
}

export async function fetchCourses(): Promise<Course[]> {
  const response = await fetchData("/api/courses", {
    method: "GET",
  });

  return response.json();
}

export interface CourseInput {
  name: string;
  code: string;
  prof: { prof_name: string; prof_email: string };
  ta: { _id: string; ta_name: string; ta_email: string }[];
  color: string;
  tasks: Task[];
}
export async function createCourse(course: CourseInput): Promise<Course> {
  const response = await fetchData("/api/courses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(course),
  });

  return response.json();
}

export async function getCourse(courseId: string): Promise<Course> {
  const response = await fetchData("/api/courses/" + courseId, {
    method: "GET",
  });

  return response.json();
}

export const getTasksByCourseId = async (courseId: string): Promise<Task[]> => {
  console.log("getting courseTasks");
  const response = await fetchData(`/api/courses/${courseId}/tasks`);

  const myTasks = await response.json();

  // console.log("myTasks: ", myTasks);
  return myTasks;
};

// kinda messy...
export async function updateCourseAndTasks(
  courseId: string,
  course: CourseInput,
  task?: Task
): Promise<Course> {
  console.log("UPDATING COURSE AND TASKS: ", courseId);

  const courseTasks = await getTasksByCourseId(courseId);
  let newCourseTasks: Task[] = []
  let courseDetails: CourseInput = {} as CourseInput
  if (task) {
    // console.log("should only see if deleting an individual task that belongs to a course")
    courseDetails = await getCourse(courseId)
    // this is also kinda redundant cuz im getting the task list twice
    newCourseTasks = courseDetails.tasks.filter(t => t + "" !== task._id)

  }

  // console.log("after getting tasks before updating course");
  let upCourse = task ? ({ ...courseDetails, tasks: newCourseTasks } as CourseInput) : course;
  const updatedCourse = await updateCourse(courseId, upCourse);

  // console.log("need to update these tasks: ", courseTasks);

  return updatedCourse;
}

export async function updateCourse(
  courseId: string,
  course: CourseInput
): Promise<Course> {
  console.log("updating course: ", course);

  const response = await fetchData("/api/courses/" + courseId, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(course),
  });

  return response.json();
}

export async function deleteCourse(courseId: string) {
  await fetchData("/api/courses/" + courseId, { method: "DELETE" });
}

import { ConflictError, UnAuthError } from "../errors/httpsErrors";
import { Course, Task } from "../models/course";
import { Dayjs } from "dayjs";

async function fetchData(input: RequestInfo, init?: RequestInit) {
  // console.log("inside fetchData task_api, we are passing: ");
  // console.log("init: ", init);
  // console.log("input: ", input);
  const response = await fetch(input, init);

  if (response.ok) {
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
        "req failed w the status: " + response.status + "msg: " + errorMessage
      );
    }
  }
}

export async function fetchTasks(): Promise<Task[]> {
  const response = await fetchData("/api/tasks", {
    method: "GET",
  });

  return response.json();
}

export interface TaskInput {
  name: string;
  start_date: Date | Dayjs | string;
  end_date: Date | Dayjs | string;
  priority: string;
  tags: string[];
  notes: string;
  completed: boolean;
  course?: Course;
  weight: number;
  earned: number;
  variety: string;
  userId?: string;
}

export async function getTask(taskId: string): Promise<Task> {
  const response = await fetchData("/api/tasks/" + taskId, {
    method: "GET",
  });

  return response.json();
}

export async function createTask(task: TaskInput): Promise<Task> {
  const response = await fetchData("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });

  return response.json();
}

export async function updateTask(
  taskId: string,
  task: TaskInput
): Promise<Task> {
  console.log("task in api: ", task);
  const response = await fetchData("/api/tasks/" + taskId, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });

  return response.json();
}

export async function deleteTask(taskId: string) {
  await fetchData("/api/tasks/" + taskId, { method: "DELETE" });
}

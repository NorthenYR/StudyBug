import { Dayjs } from "dayjs";

export interface Task {
  _id: string;
  name: string;
  start_date: Date | Dayjs | string;
  end_date: Date | Dayjs | string;
  priority: string;
  tags: string[];
  notes: string;
  completed: boolean;
  course: Course;
  weight: number;
  earned: number;
  variety: string;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  _id: string;
  name: string;
  code: string;
  prof: { prof_name: string; prof_email: string };
  ta: Array<{ ta_name: string; ta_email: string; _id: string}>;
  color: string;
  tasks: Array<Task>;
  createdAt: string;
  updatedAt: string;
}

/*
export interface CalEvent {
  _id: string;
  title: string;
  start: Date | Dayjs | string;
  end: Date | Dayjs | string;
}
*/
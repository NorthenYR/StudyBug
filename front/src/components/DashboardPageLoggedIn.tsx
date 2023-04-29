
import CalendarSummary from "./Dashboard/CalendarSummary";
import CourseSummary from "./Dashboard/CourseSummary";
import { Box } from "@mui/system";
import * as CoursesApi from "../network/courses_api"
import * as TasksApi from "../network/tasks_api"
import { Course as CourseModel } from "../models/course";
import { Task as TaskModel } from "../models/course";
import React, { useState, useEffect, useContext } from "react";
import { StudyBugContext } from "../App";
import dayjs from "dayjs";



const DashboardPageLoggedIn = () => {

  const [coursesLoading, setCoursesLoading] = useState(true);
  const [showCoursesLoadingError, setShowCoursesLoadingError] = useState(false);
  const [tasks, setTasks] = useState<TaskModel[]>([]);
  const [courses, setCourses] = useState<CourseModel[]>([]);

  const [tasksLoading, setTasksLoading] = useState<boolean>(true);
  const [showTasksLoadingError, setShowTasksLoadingError] = useState(false);

  const [showTaskForm, setShowTaskForm] = useState<boolean>(false);
  const { loggedInUser, userTagsMenuOpen } = useContext(StudyBugContext);
  const [formatTasks, setFormatTasks] = useState<TaskModel[]>([]);

  async function loadTasks() {
    try {
      setShowTasksLoadingError(false);
      setTasksLoading(true);
      const tasks = await TasksApi.fetchTasks();
      const courses = await CoursesApi.fetchCourses();
      setTasks(tasks);
      setCourses(courses);
    } catch (error) {
      console.error(error);
      setShowTasksLoadingError(true);
    } finally {
      setTasksLoading(false);
    }
  }

  const updateTasks = () => {
  const temp: React.SetStateAction<TaskModel[]> = []
  tasks.forEach((task) => {
    temp.push({
      completed: task.completed,
      course: task.course,
      createdAt: task.createdAt,
      earned: task.earned,
      end_date: dayjs(task.end_date).toDate(),
      name: task.name,
      notes: task.notes,
      priority: task.priority,
      start_date: dayjs(task.start_date).toDate(),
      tags: task.tags,
      updatedAt: task.updatedAt,
      variety: task.variety,
      weight: task.weight,
      _id: task._id
    })
    
  })
  setFormatTasks(temp)
  }

  useEffect(() => {
		loadTasks();
	}, []); 

  useEffect(() => {
    updateTasks();
  }, [tasks] )


  return (
    <Box>
      <h1 style={{marginLeft: "6vh", marginTop: "3vh"}}>This Week</h1>
    <CalendarSummary courses={courses} tasks={tasks} formatTasks={formatTasks}/> 
    <h1 style={{marginLeft: "6vh"}}>My Courses</h1>
    <CourseSummary courses={courses} tasks={tasks}/>
    </Box>

  );
};

export default DashboardPageLoggedIn;


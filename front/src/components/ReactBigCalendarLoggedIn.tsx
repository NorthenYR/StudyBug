import React, { useState, useEffect, useContext, useCallback  } from "react";
import { Calendar, momentLocalizer} from "react-big-calendar";
import moment from "moment";
import Box from '@mui/material/Box';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Course, Task as TaskModel } from "../models/course";
import { Course as CourseModel } from "../models/course";
import * as TasksApi from "../network/tasks_api";
import * as CoursesApi from "../network/courses_api";
import { StudyBugContext } from "../App";


import {
  Drawer,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Task from "./Task";
import "../styles/task.css";
import "../styles/ToDo.css";
import TaskForm from "./TaskForm";
import { CourseInput } from "../network/courses_api";

import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import { taskVariety, taskPriority } from "../utils/Utils";
import { get } from "http";
import dayjs from "dayjs";


moment.locale("en-US");
const localizer = momentLocalizer(moment);


const ReactBigCalendarLoggedIn = () => {
  const [tasks, setTasks] = useState<TaskModel[]>([]);
  const [courses, setCourses] = useState<CourseModel[]>([]);

  const [tasksLoading, setTasksLoading] = useState<boolean>(true);
  const [showTasksLoadingError, setShowTasksLoadingError] = useState(false);

  const [showTaskForm, setShowTaskForm] = useState<boolean>(false);
  const { loggedInUser, userTagsMenuOpen } = useContext(StudyBugContext);
  const tags = loggedInUser!.allTags;
  const [taskToEdit, setTaskToEdit] = useState<TaskModel | null>(null);
  const [open, setOpen] = useState<boolean>(false);

 // const [formatTasks, setFormatTasks] = useState<TaskModel[]>([]);

  // to be clear, these boolean values dont really represent anything
  // toggling them will either expand or unexpand all task values
  const [expandAll, setExpandAll] = useState<boolean>(true);
  const [unexpandAll, setUnexpandAll] = useState<boolean>(false);

  // these are the filters that are currently set to something
  const emptyFilters = {
    class: [],
    tags: [],
    completed: [],
    priority: [],
    variety: [],
  };

  const [filters, setFilters] = useState<Filters>(emptyFilters);

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

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    console.log("FILTERS: ", filters);
  }, [filters]);

  // TODO: this could probably be done better/differently but it works for now
  useEffect(() => {
    console.log("user tags menu open: ", userTagsMenuOpen);
    if (!userTagsMenuOpen) {
      loadTasks();
    }
  }, [userTagsMenuOpen]);

  // TODO: should probably move this elsewhere
  async function deleteTaskFromCourse(task: TaskModel) {
    try {
      await CoursesApi.updateCourseAndTasks(
        task.course + "",
        {} as CourseInput,
        task
      );
    } catch (error) {
      console.log("err deleting task from tasks in course");
      console.error(error);
    }
  }


  const filterTasks = (allTasks: TaskModel[]): TaskModel[] => {
    if (filters.class.length > 0) {
      console.log("filtering courses");
      allTasks = filterTasksByProperty(allTasks, "course", filters.class);
    }

    if (filters.tags.length > 0) {
      allTasks = filterTasksByProperty(allTasks, "tags", filters.tags);
      // console.log("allTasks after filtering by tag prop: ", allTasks);
    }

    if (filters.priority.length > 0) {
      allTasks = filterTasksByProperty(allTasks, "priority", filters.priority);
    }

    if (filters.variety.length > 0) {
      allTasks = filterTasksByProperty(allTasks, "variety", filters.variety);
    }

    if (filters.completed.length > 0) {
      allTasks = filterTasksByProperty(
        allTasks,
        "completed",
        filters.completed
      );
    }

    return allTasks;
  };


  let filteredTasks = filterTasks(tasks);

  useEffect(() => {
    console.log("filtered Tasks updated: ", filteredTasks);
  }, [filterTasks]);


  // TODO: break the repeating part of this out into one more function
  const handleFilters = (filter: string, val: string) => {
    switch (filter) {
      // TODO: this isn't working perfectly...
      case "tags":
        if (filters.tags.includes(val)) {
          setFilters({
            ...filters,
            tags: filters.tags.filter((t) => t !== val),
          });
        } else {
          setFilters({ ...filters, tags: [...filters.tags, val] });
        }
        break;
      case "class":
        if (filters.class.includes(val)) {
          setFilters({
            ...filters,
            class: filters.class.filter((c) => c !== val),
          });
        } else {
          setFilters({ ...filters, class: [...filters.class, val] });
        }
        break;
      case "variety":
        if (filters.variety.includes(val)) {
          setFilters({
            ...filters,
            variety: filters.variety.filter((v) => v !== val),
          });
        } else {
          setFilters({ ...filters, variety: [...filters.variety, val] });
        }
        break;
      case "priority":
        if (filters.priority.includes(val)) {
          setFilters({
            ...filters,
            priority: filters.priority.filter((p) => p !== val),
          });
        } else {
          setFilters({ ...filters, priority: [...filters.priority, val] });
        }
        break;
      case "completed":
        if (filters.completed.includes(val)) {
          setFilters({
            ...filters,
            completed: filters.completed.filter((c) => c !== val),
          });
        } else {
          setFilters({ ...filters, completed: [...filters.completed, val] });
        }
        break;
      case "clear":
        setFilters(emptyFilters);
        break;
      default:
        console.log("err in filters");
    }
  };

  function filterTasksByProperty(
    tasks: TaskModel[],
    propertyName: "priority" | "variety" | "tags" | "course" | "completed",
    possibleValues: string[]
  ): TaskModel[] {
    switch (propertyName) {
      case "priority":
      case "variety":
        return tasks.filter((task) =>
          possibleValues.includes(task[propertyName])
        );

      case "tags":
        let temp1: TaskModel[] = [];

        for (let tag of possibleValues) {
          let t = tasks.filter((task) => task.tags.includes(tag));
          temp1 = temp1.concat(t);
        }

        return temp1;

      case "course":
        return tasks.filter((task) =>
          task.course ? possibleValues.includes(task.course.toString()) : false
        );

      case "completed":
        if (possibleValues.length > 1) {
          return tasks;
        }

        let temp2 = tasks;
        if (possibleValues.includes("Completed")) {
          temp2 = tasks.filter((task) => task.completed === true);
        }

        if (possibleValues.includes("Not Completed")) {
          temp2 = tasks.filter((task) => task.completed === false);
        }

        return temp2;

      default:
        console.log("err in filtering tasks");
        return tasks;
    }
  }

  interface PriorityOrder {
    [key: string]: number;
  }

  const [courseDetails, setCourseDetails] = useState<Course>({} as Course);

  const getCourseDetails = async (event:any) => {
    let c = await CoursesApi.getCourse(event.course + "");
    setCourseDetails(c);
  };
  const eventPropGetter = (event:any) => {
    // getCourseDetails(event)
    var style = {
      backgroundColor: event.course ? "orange" : "lightgrey",
      borderRadius: '0px',
      opacity: 0.8,
      color: '#1a1a1a',
      border: '0px',
      display: 'block'
    };
    return {
      style: style
    };
  }
/*
  const updateTasks = () => {
    const temp: React.SetStateAction<TaskModel[]> = []
    filteredTasks.forEach((task) => {
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
      updateTasks();
    }, [tasks] )
*/
  return (
		<div className='todoLoggedIn'>
			{/* to edit an existing task */}
			<Modal open={taskToEdit !== null} onClose={() => setTaskToEdit(null)}>
				<TaskForm
					tasktoEdit={taskToEdit!}
					onDismiss={() => {
						console.log('task form dismiss');
						setTaskToEdit(null);
					}}
					onTaskSaved={(updatedTask) => {
						console.log('setting update task');
						setTasks(
							tasks.map((t) => (t._id === updatedTask._id ? updatedTask : t))
						);
					}}
				/>
			</Modal>

			{/* to create a new non aca task */}
			<Modal
				open={showTaskForm && !taskToEdit}
				onClose={() => setShowTaskForm(false)}>
				<TaskForm
					onDismiss={() => {
						console.log('task form dismiss');
						setShowTaskForm(false);
					}}
					onTaskSaved={(newTask) => {
						console.log('setting new non aca task');
						setTasks([...tasks, newTask]);
						setShowTaskForm(false);
					}}
				/>
			</Modal>
			<div
				className='todoNav'
				style={{
					width: open ? 'calc(100% - 300px)' : '100%',
					marginLeft: open ? '300px' : '0px',
				}}>
				<div>
					<div
						className='controlDrawer'
						style={{ rotate: open ? '0deg' : '180deg' }}
						onClick={() => setOpen(!open)}>
						<ChevronLeftIcon style={{ color: 'white' }} />
					</div>
				</div>
			</div>
			<div className={open ? 'rightOfDrawerOpen' : 'rightOfDrawerClosed'}>
				{tasksLoading && <h1>LOADING...</h1>}
				{showTasksLoadingError && (
					<h1>🐛: SOMETHING WENT WRONG, PLEASE REFRESH</h1>
				)}

				{!tasksLoading && !showTasksLoadingError && (
					<div className='taskList'>
						<Box width={'100%'}>
							<Calendar
								//views={['month', 'work_week', 'day', 'agenda']}
                views={['month', 'week', 'day', 'agenda']} //the package we are using is kinda broken rn so we only have 2 views for now
								localizer={localizer}
								defaultDate={new Date()}
								defaultView='month'
								events={filteredTasks}
                titleAccessor={'name'}
                startAccessor={'start_date'}
                endAccessor={'end_date'}
                resourceIdAccessor={'_id'}
								style={{ height: '84vh'}}
								selectable={false}
                eventPropGetter={eventPropGetter}
							/>
						</Box>
            <>{console.log(filteredTasks)}</>
					</div>
 
				)}
			</div>

			{/* TODO: make this it's own component */}
			<Drawer
				open={open}
				variant='persistent'
				anchor={'left'}
				className='filterDrawer'
				sx={{
					width: '300px',
					height: '100%',
					'& .MuiDrawer-paper': {
						width: '300px',
						marginTop: '10vh',
						padding: '10px',
						paddingTop: '0px',
						height: '90vh',
						borderRight: '1px solid #1a1a1a',
						borderTop: '1px solid #1a1a1a',
						boxSizing: 'border-box',
					},
				}}>
				<div className='drawerHeader'>
					<div className='drawerHeaderTitles'>
						<span>Filter Tasks</span>
						<span>
							({filteredTasks.length}/{tasks.length})
						</span>
					</div>
				</div>
				<div style={{ paddingTop: 50 }}></div>
				<span className='filterTitleBig'>Filter By:</span>
				<div className='tagsFilter filterSection'>
					<span className='filterTitle'>Tags:</span>
					{tags.map((t, i) => (
						<div
							key={i}
							className={
								filters.tags.includes(t)
									? 'filterTagSelected'
									: 'filterTagUnSelected'
							}
							onClick={() => handleFilters('tags', t)}>
							{t}
						</div>
					))}
				</div>

				<div className='classFilter filterSection'>
					<span className='filterTitle'>Class:</span>

					{courses.map((course) => (
						<FormControlLabel
							control={<Checkbox />}
							checked={filters.class.includes(course._id)}
							onChange={() => handleFilters('class', course._id)}
							label={course.name}
						/>
					))}
				</div>

				<div className='varietyFilter filterSection'>
					<span className='filterTitle'>Type:</span>

					{Object.values(taskVariety).map((v) => (
						<FormControlLabel
							control={<Checkbox />}
							checked={filters.variety.includes(v)}
							onChange={() => handleFilters('variety', v)}
							label={v}
						/>
					))}
				</div>

				<div className='priorityFilter filterSection'>
					<span className='filterTitle'>Priority:</span>

					{Object.values(taskPriority).map((p) => (
						<FormControlLabel
							control={<Checkbox />}
							checked={filters.priority.includes(p)}
							onChange={() => handleFilters('priority', p)}
							label={p}
						/>
					))}
				</div>

				<div className='completedFilter filterSection'>
					<span className='filterTitle'>Completion:</span>
					<FormControlLabel
						control={<Checkbox />}
						checked={filters.completed.includes('Completed')}
						onChange={() => handleFilters('completed', 'Completed')}
						label={'Completed'}
					/>
					<FormControlLabel
						control={<Checkbox />}
						checked={filters.completed.includes('Not Completed')}
						onChange={() => handleFilters('completed', 'Not Completed')}
						label={'Not Completed'}
					/>
				</div>

				<div className='clearAll' onClick={() => handleFilters('clear', '')}>
					Clear All Filters
				</div>
			</Drawer>
		</div>
	);
};

export default ReactBigCalendarLoggedIn;

export interface Filters {
  class: string[];
  tags: string[];
  completed: string[];
  priority: string[];
  variety: string[];
}




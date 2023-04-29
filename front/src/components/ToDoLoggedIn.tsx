import { useState, useEffect, useContext } from "react";
import { Task as TaskModel } from "../models/course";
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

const ToDoLoggedIn = () => {
  const [tasks, setTasks] = useState<TaskModel[]>([]);
  const [courses, setCourses] = useState<CourseModel[]>([]);

  const [tasksLoading, setTasksLoading] = useState<boolean>(true);
  const [showTasksLoadingError, setShowTasksLoadingError] = useState(false);

  const [showTaskForm, setShowTaskForm] = useState<boolean>(false);
  const { loggedInUser, userTagsMenuOpen } = useContext(StudyBugContext);
  const tags = loggedInUser!.allTags;
  const [taskToEdit, setTaskToEdit] = useState<TaskModel | null>(null);
  const [open, setOpen] = useState<boolean>(false);

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
  const [sort, setSort] = useState<string>("Course");

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

  async function deleteTask(task: TaskModel) {
    console.log("deleting task");
    try {
      deleteTaskFromCourse(task);
      await TasksApi.deleteTask(task._id);
      // TODO: double check on this...
      setTasks(tasks.filter((t) => t._id !== task._id));
      console.log("task deleted");
    } catch (error) {
      console.log("err deleting task");
      console.error(error);
    }
  }

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

  const handleSort = (event: SelectChangeEvent) => {
    setSort(event.target.value as string);
  };

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

  const sortTasks = (filTasks: TaskModel[]): TaskModel[] => {
    switch (sort) {
      case "Due Date":
        filTasks.sort((taskA, taskB) => {
          if (
            typeof taskA.end_date !== "string" ||
            typeof taskB.end_date !== "string"
          ) {
            console.log("err sorting by due date");
            // TODO: come back to this
            return 0;
          }
          const dateA = new Date(taskA.end_date);
          const dateB = new Date(taskB.end_date);
          return dateA.getTime() - dateB.getTime();
        });
        break;
      case "Priority":
        filTasks.sort((taskA, taskB) => {
          const priorityOrder: PriorityOrder = {
            High: 0,
            Medium: 1,
            Low: 2,
          };
          const priorityA = priorityOrder[taskA.priority];
          const priorityB = priorityOrder[taskB.priority];
          return priorityA - priorityB;
        });
        break;
      case "Weight":
        filTasks.sort((taskA, taskB) => {
          return taskB.weight - taskA.weight;
        });
        break;
      case "Course":
        // technically this sorts them by courseID alphabetically which is kinda random
        // but whatever I just wanted them to be grouped by course
        filTasks.sort((taskA, taskB) => {
          if (!taskA.course || !taskB.course) {
            return 0;
          }

          let tA = taskA.course.toString();
          let tB = taskB.course.toString();
          return tA < tB ? -1 : tA > tB ? 1 : 0;
        });
        break;
      default:
        console.log("end sorting");
    }

    return filTasks;
  };

  let filteredTasks = filterTasks(tasks);
  let filteredSortedTasks = sortTasks(filteredTasks);

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

  // TODO: pass the course details into the task here instead of getting it twice
  const taskList = filteredSortedTasks.map((task) => (
    <Task
      task={task}
      expandAll={expandAll}
      unexpandAll={unexpandAll}
      onTaskClicked={setTaskToEdit}
      onDeleteTaskClicked={deleteTask}
      key={task._id}
      onTaskCompleted={(updatedTask) => {
        setTasks(
          tasks.map((t) => (t._id === updatedTask._id ? updatedTask : t))
        );
      }}
    />
  ));

  return (
    <div className="todoLoggedIn">
      {/* to edit an existing task */}
      <Modal open={taskToEdit !== null} onClose={() => setTaskToEdit(null)}>
        <TaskForm
          tasktoEdit={taskToEdit!}
          onDismiss={() => {
            console.log("task form dismiss");
            setTaskToEdit(null);
          }}
          onTaskSaved={(updatedTask) => {
            console.log("setting update task");
            setTasks(
              tasks.map((t) => (t._id === updatedTask._id ? updatedTask : t))
            );
          }}
        />
      </Modal>

      {/* to create a new non aca task */}
      <Modal
        open={showTaskForm && !taskToEdit}
        onClose={() => setShowTaskForm(false)}
      >
        <TaskForm
          onDismiss={() => {
            console.log("task form dismiss");
            setShowTaskForm(false);
          }}
          onTaskSaved={(newTask) => {
            console.log("setting new non aca task");
            setTasks([...tasks, newTask]);
            setShowTaskForm(false);
          }}
        />
      </Modal>
      <div
        className="todoNav"
        style={{
          width: open ? "calc(100% - 300px)" : "100%",
          marginLeft: open ? "300px" : "0px",
        }}
      >
        <div>
          <div
            className="controlDrawer"
            style={{ rotate: open ? "0deg" : "180deg" }}
            onClick={() => setOpen(!open)}
          >
            <ChevronLeftIcon style={{ color: "white" }} />
          </div>

          <button onClick={() => setUnexpandAll(!unexpandAll)}>
            CLOSE ALL
          </button>
          <button onClick={() => setExpandAll(!expandAll)}>OPEN ALL</button>
        </div>

        <button onClick={() => setShowTaskForm(!showTaskForm)}>+</button>
      </div>
      <div className={open ? "rightOfDrawerOpen" : "rightOfDrawerClosed"}>
        {tasksLoading && <h1>LOADING...</h1>}
        {showTasksLoadingError && (
          <h1>🐛: SOMETHING WENT WRONG, PLEASE REFRESH</h1>
        )}

        {!tasksLoading && !showTasksLoadingError && (
          <div className="taskList">{taskList}</div>
        )}
      </div>

      {/* TODO: make this it's own component */}
      <Drawer
        open={open}
        variant="persistent"
        anchor={"left"}
        className="filterDrawer"
        sx={{
          width: "300px",
          height: "100%",
          "& .MuiDrawer-paper": {
            width: "300px",
            marginTop: "10vh",
            padding: "10px",
            paddingTop: "0px",
            height: "90vh",
            borderRight: "1px solid #1a1a1a",
            borderTop: "1px solid #1a1a1a",
            boxSizing: "border-box",
          },
        }}
      >
        <div className="drawerHeader">
          <div className="drawerHeaderTitles">
            <span>Filter Tasks</span>
            <span>
              ({filteredSortedTasks.length}/{tasks.length})
            </span>
          </div>
        </div>

        <div className="sort">
          <span className="filterTitleBig">Sort By:</span>

          <Select className="sortSelect" value={sort} onChange={handleSort}>
            {sorts.map((s, i) => (
              <MenuItem key={i} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </div>

        <span className="filterTitleBig">Filter By:</span>

        <div className="tagsFilter filterSection">
          <span className="filterTitle">Tags:</span>
          {tags.map((t, i) => (
            <div
              key={i}
              className={
                filters.tags.includes(t)
                  ? "filterTagSelected"
                  : "filterTagUnSelected"
              }
              onClick={() => handleFilters("tags", t)}
            >
              {t}
            </div>
          ))}
        </div>

        <div className="classFilter filterSection">
          <span className="filterTitle">Class:</span>

          {courses.map((course) => (
            <FormControlLabel
              control={<Checkbox />}
              checked={filters.class.includes(course._id)}
              onChange={() => handleFilters("class", course._id)}
              label={course.name}
            />
          ))}
        </div>

        <div className="varietyFilter filterSection">
          <span className="filterTitle">Type:</span>

          {Object.values(taskVariety).map((v) => (
            <FormControlLabel
              control={<Checkbox />}
              checked={filters.variety.includes(v)}
              onChange={() => handleFilters("variety", v)}
              label={v}
            />
          ))}
        </div>

        <div className="priorityFilter filterSection">
          <span className="filterTitle">Priority:</span>

          {Object.values(taskPriority).map((p) => (
            <FormControlLabel
              control={<Checkbox />}
              checked={filters.priority.includes(p)}
              onChange={() => handleFilters("priority", p)}
              label={p}
            />
          ))}
        </div>

        <div className="completedFilter filterSection">
          <span className="filterTitle">Completion:</span>
          <FormControlLabel
            control={<Checkbox />}
            checked={filters.completed.includes("Completed")}
            onChange={() => handleFilters("completed", "Completed")}
            label={"Completed"}
          />
          <FormControlLabel
            control={<Checkbox />}
            checked={filters.completed.includes("Not Completed")}
            onChange={() => handleFilters("completed", "Not Completed")}
            label={"Not Completed"}
          />
        </div>

        <div className="clearAll" onClick={() => handleFilters("clear", "")}>
          Clear All Filters
        </div>
      </Drawer>
    </div>
  );
};

export default ToDoLoggedIn;

export interface Filters {
  class: string[];
  tags: string[];
  completed: string[];
  priority: string[];
  variety: string[];
}

export const sorts: string[] = ["Due Date", "Priority", "Weight", "Course"];

import { useState, useEffect } from "react";
import { TaskInput } from "../network/tasks_api";
import * as TaskApi from "../network/tasks_api";
import * as CourseApi from "../network/courses_api";
import { Course, Task as TaskModel } from "../models/course";
import { niceDate } from "../utils/Utils";
import "../styles/task.css";
import {
  Check,
  ExpandMore,
  FitnessCenter,
  CalendarMonth,
  NewReleases,
  Assignment,
  Edit,
} from "@mui/icons-material";

interface TaskProps {
  task: TaskModel;
  expandAll: boolean;
  drawerOpen?: boolean;
  unexpandAll: boolean;
  onTaskClicked: (task: TaskModel) => void;
  onDeleteTaskClicked: (task: TaskModel) => void;
  onTaskCompleted: (task: TaskModel) => void;
}

const Task = ({
  task,
  onTaskCompleted,
  onTaskClicked,
  expandAll,
  unexpandAll,
  drawerOpen,
  onDeleteTaskClicked,
}: TaskProps) => {
  const {
    completed,
    course,
    name,
    priority,
    tags,
    notes,
    weight,
    earned,
    variety,
    start_date,
    end_date,
    _id,
  } = task;

  const [courseDetails, setCourseDetails] = useState<Course>({} as Course);

  useEffect(() => {
    if (course) {
      getCourseDetails();
    }
  }, []);

  const getCourseDetails = async () => {
    let c = await CourseApi.getCourse(course + "");
    setCourseDetails(c);
  };

  const sd = niceDate(start_date);
  const ed = niceDate(end_date);

  // const t = await Task.findById(_id).populate('course')
  // const courseColor = t.course.name

  const [expand, setExpand] = useState<boolean>(true);

  useEffect(() => {
    setExpand(false);
  }, [unexpandAll]);

  useEffect(() => {
    setExpand(true);
  }, [expandAll]);

  useEffect(() => {}, [completed]);

  const defaultInput: TaskInput = {
    name: name,
    start_date: start_date,
    end_date: end_date,
    priority: priority,
    tags: tags,
    notes: notes,
    completed: completed,
    weight: weight,
    earned: earned,
    course: course || undefined,
    variety: variety,
  };

  async function handleComplete() {
    console.log("toggling task complete");
    try {
      let taskRes: TaskModel;

      const input = {
        ...defaultInput,
        completed: !completed,
      } as TaskInput;
      console.log("updating task w this: ", input);

      taskRes = await TaskApi.updateTask(task._id, input);

      onTaskCompleted(taskRes);
    } catch (error) {
      console.log("err toggling task complete: ", error);
    }
  }

  return (
    <div
      className="task"
      style={{
        backgroundColor: course ? courseDetails.color : "lightgrey",
        height: expand ? "200px" : "75px",
        padding: expand ? "10px 30px" : "20px 30px",
        // marginLeft: drawerOpen ? "15.5%" : "100%"
      }}
    >
      <div className="taskTop">
        <div className="taskTopLeft">
          <span
            className="taskTitle"
            style={{ opacity: completed ? "50%" : "100%" }}
          >
            {completed ? <s>{name}</s> : name}
          </span>
          <span className="taskCourse">{courseDetails?.name || "Other"}</span>
        </div>

        <div className="taskTopRight">
          <div
            className="expandTask"
            style={{ rotate: expand ? "0deg" : "180deg" }}
          >
            <ExpandMore
              style={{ color: "#1a1a1a", fontSize: 70 }}
              onClick={() => {
                setExpand(!expand);
              }}
            />
          </div>
          <div
            className="completeTask"
            onClick={handleComplete}
            style={{ backgroundColor: completed ? "#1a1a1a" : "" }}
          >
            {completed && (
              <Check
                style={{
                  color: course ? courseDetails.color : "lightgrey",
                  fontSize: 30,
                }}
              />
            )}
          </div>
        </div>
      </div>
      {expand && (
        <>
          <div className="divider"></div>
          <div className="taskBottom">
            <div className="taskBottomLeft">
              <div className="taskStat">
                <Assignment className="taskIcon" />
                {variety}
              </div>
              <div className="taskStat">
                <CalendarMonth className="taskIcon" />
                <span>{ed}</span>
              </div>
              <div className="taskStat">
                <FitnessCenter className="taskIcon" />
                {weight}%
              </div>
              <div className="taskStat">
                <NewReleases className="taskIcon" />
                {priority}
              </div>
            </div>
            <div className="taskBottomMiddle">Notes: {notes}</div>
            <div className="taskBottomRight">
              <div className="relDocs">
                <div>
                  <span>Relevant Documents</span>
                  <div className="relDocsList">
                    <div className="relDoc"></div>
                    <div className="relDoc"></div>
                    <div className="relDoc"></div>
                  </div>
                </div>
              </div>

              <div className="editTask" onClick={() => onTaskClicked(task)}>
                <Edit
                  className="taskIcon"
                  style={{
                    color: course ? courseDetails.color : "lightgrey",
                    fontSize: 20,
                  }}
                />
              </div>
            </div>
          </div>
        </>
      )}

      <div
        className="deleteButton deleteTaskButton"
        onClick={(e) => {
          onDeleteTaskClicked(task);
          e.stopPropagation();
        }}
      >
        x
      </div>
    </div>
  );
};

export default Task;

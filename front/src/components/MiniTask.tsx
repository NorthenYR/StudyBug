import { useEffect, useState } from "react";
import { Task } from "../models/course";
import { niceDate } from "../utils/Utils";
import * as TasksApi from "../network/tasks_api";

interface MiniTaskProps {
  task: Task;
}

const MiniTask = (props: MiniTaskProps) => {
  const { task } = props;
  const [taskDetails, setTaskDetails] = useState({} as Task);
  const [duedate, setDueDate] = useState("");

  useEffect(() => {
    getTask(task);
  }, []);

  const getTask = async (myTask: Task) => {
    let t = await TasksApi.getTask(myTask._id + "");
    setTaskDetails(t);
    setDueDate(niceDate(t.end_date));
  };

  return (
    <div className="miniTask">
      <div>
        <span className="miniTaskItem">{taskDetails.name}</span>
      </div>

      <div>
        {task.earned && <span className="miniTaskItem">{task.earned}%</span>}|
        <span className="miniTaskItem">{duedate}</span>|
        <span className="miniTaskItem">{taskDetails.weight}%</span>|
        <span className="miniTaskItem">{taskDetails.variety}</span>|
        <span className="miniTaskItem">{taskDetails.priority}</span>
      </div>
    </div>
  );
};

export const CourseTaskPreview = (props: MiniTaskProps) => {
  const { task } = props;

  const [myTask, setMyTask] = useState<Task>({} as Task);

  const getTask = async (myTask: Task) => {
    console.log("RUNNING GET TASK: ", task);
    let t = await TasksApi.getTask(myTask + "");
    // console.log("t: ", t);
    setMyTask(t);
  };

  useEffect(() => {
    console.log("TASK IN MINITASKS: ", task);
    getTask(task);
  }, []);
  let taskDetails = myTask;

  // console.log("task passed for preview: ", taskDetails);
  let mm, dd, tt;
  if (taskDetails.end_date) {
    mm = new Date(taskDetails.end_date?.toLocaleString()).toLocaleString(
      "default",
      { month: "short" }
    );
    dd = new Date(taskDetails.end_date?.toLocaleString()).toLocaleString(
      "default",
      { day: "2-digit" }
    );

    tt = new Date(taskDetails.end_date?.toLocaleString()).toLocaleString(
      "en-US",
      {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }
    );
  }

  return (
    <div className="courseTaskPreview">
      {taskDetails.end_date && (
        <>
          <div className="courseTaskPreviewLeft">
            {mm}
            <br />
            {dd}
          </div>
          <div className="courseTaskPreviewRight">
            {tt}
            <br />
            {taskDetails.name}
          </div>{" "}
        </>
      )}
    </div>
  );
};

export default MiniTask;

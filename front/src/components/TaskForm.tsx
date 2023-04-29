import { useEffect, useState } from "react";
import { Course, Task } from "../models/course";
import { useForm, Controller } from "react-hook-form";
import { TaskInput } from "../network/tasks_api";
import * as TaskApi from "../network/tasks_api";
import TextInputField from "./form/TextInputField";
import { MenuItem, TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";
import { taskVariety, taskPriority } from "../utils/Utils";
import "../styles/TaskForm.css";
import UserTags from "./UserTags";

interface TaskFormProps {
  tasktoEdit?: Task;
  deleteTaskForm?: React.Dispatch<React.SetStateAction<number>>;
  course?: Course;
  onDismiss?: () => void;
  onTaskSaved: (task: Task) => void;
}

export interface IDetails {
  name: string;
  start_date: Date | Dayjs | string;
  end_date: Date | Dayjs | string;
  priority: string;
  tags: string[];
  notes: string;
  weight: number;
  earned: number;
  variety: string;
}

const TaskForm = (props: TaskFormProps) => {
  const { course, tasktoEdit, onTaskSaved, deleteTaskForm } = props;

  console.log("course: ", course);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskInput>({
    defaultValues: {
      name: tasktoEdit?.name || "",
      start_date: tasktoEdit?.start_date || dayjs(),
      end_date: tasktoEdit?.end_date || dayjs(),
      priority: tasktoEdit?.priority || taskPriority.High,
      tags: tasktoEdit?.tags || [],
      notes: tasktoEdit?.notes || "",
      completed: tasktoEdit?.completed || false,
      weight: tasktoEdit?.weight || 50,
      earned: tasktoEdit?.earned || 50,
      course: course || undefined,
      variety: tasktoEdit?.variety || taskVariety.Assignment,
    },
  });

  const [details, setDetails] = useState<IDetails>({
    name: "",
    start_date: "",
    end_date: "",
    priority: "",
    tags: tasktoEdit?.tags || [],
    notes: "",
    weight: 0,
    earned: 0,
    variety: "",
  });

  useEffect(() => {
    console.log("details updated: ", details);
  }, [details]);

  const taskVarieties = [
    { value: taskVariety.Assignment, label: taskVariety.Assignment },
    { value: taskVariety.Lecture, label: taskVariety.Lecture },
    { value: taskVariety.Lab, label: taskVariety.Lab },
    { value: taskVariety.Exam, label: taskVariety.Exam },
    { value: taskVariety.Other, label: taskVariety.Other },
  ];

  const taskPriorities = [
    { value: taskPriority.High, label: taskPriority.High },
    { value: taskPriority.Medium, label: taskPriority.Medium },
    { value: taskPriority.Low, label: taskPriority.Low },
  ];

  async function subTask(input: TaskInput) {
    console.log("submitting task");

    input = { ...input, tags: details.tags };
    try {
      let taskRes: Task;
      if (tasktoEdit) {
        console.log("updating task");
        taskRes = await TaskApi.updateTask(tasktoEdit._id, input);
      } else {
        console.log("creation input: ", input);
        taskRes = await TaskApi.createTask(input);
      }
      onTaskSaved(taskRes);
      // console.log("after task saved");
    } catch (error) {
      console.log("err creating or updating task: ", error);
    }
  }

  return (
    <div
      className="taskFormContainer"
      style={{
        marginTop: "100px",
        marginBottom: "100px",
      }}
    >
      <form id="taskForm" onSubmit={handleSubmit((input) => subTask(input))}>
        <div className="tagsTitle rowInput">Task Details</div>

        <div className="rowInput">
          <TextInputField
            fullWidth
            setDetails={setDetails}
            details={details}
            className="taskFormInput"
            label="Task Name:"
            register={register}
            registerOptions={{ required: "Required" }}
            error={errors.name}
            name="name"
            // value={details.name}
          />
        </div>

        <div className="rowInput">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              control={control}
              defaultValue=""
              render={({ field: { onChange, value } }) => (
                <DateTimePicker
                  label="Start Date"
                  className="taskFormInput"
                  value={value}
                  onChange={onChange}
                  renderInput={(params) => (
                    <TextField
                      className="taskFormInput"
                      fullWidth
                      {...params}
                    />
                  )}
                />
              )}
              name="start_date"
            ></Controller>
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              control={control}
              defaultValue=""
              render={({ field: { onChange, value } }) => (
                <DateTimePicker
                  label="Due Date"
                  className="taskFormInput"
                  value={value}
                  onChange={onChange}
                  renderInput={(params) => (
                    <TextField
                      className="taskFormInput"
                      fullWidth
                      {...params}
                    />
                  )}
                />
              )}
              name="end_date"
            ></Controller>
          </LocalizationProvider>
        </div>

        <div className="rowInput">
          <TextInputField
            fullWidth
            select
            className="taskFormInput"
            label="Variety:"
            register={register}
            registerOptions={{ required: "Required" }}
            error={errors.variety}
            name="variety"
            // value={details.variety}
            details={details}
            setDetails={setDetails}
            defaultValue={taskVariety.Assignment}
          >
            {taskVarieties.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextInputField>

          <TextInputField
            fullWidth
            label="Weight (%):"
            type="number"
            className="taskFormInput"
            register={register}
            registerOptions={{ required: "Required" }}
            error={errors.weight}
            name="weight"
            InputProps={{ inputProps: { min: 1, max: 100 } }}
            // value={details.weight}
            details={details}
            setDetails={setDetails}
          />
        </div>

        <div className="rowInput">
          <TextInputField
            fullWidth
            select
            label="Priority:"
            className="taskFormInput"
            register={register}
            registerOptions={{ required: "Required" }}
            error={errors.priority}
            name="priority"
            defaultValue={taskPriority.High}
            // value={details.priority}
            details={details}
            setDetails={setDetails}
          >
            {taskPriorities.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextInputField>
          <TextInputField
            fullWidth
            label="Earned (%):"
            className="taskFormInput"
            register={register}
            error={errors.earned}
            type="number"
            InputProps={{ inputProps: { min: 1, max: 100 } }}
            name="earned"
            // value={details.earned}
            details={details}
            setDetails={setDetails}
          />
        </div>

        <div className="rowInput">
          <TextInputField
            type="text"
            multiline
            maxLines={null}
            label="Notes: "
            className="taskFormInput"
            fullWidth
            register={register}
            error={errors.notes}
            details={details}
            setDetails={setDetails}
            name="notes"
          />
        </div>

        <div className="tagsTitle rowInput">Tags Applied:</div>
        <div id="tagsApplied">
          {details.tags.map((t, i) => (
            <AppliedTag key={i} tag={t} />
          ))}
        </div>
        <div className="tagsTitle rowInput">All User Tags</div>

        <div className="taskUserTags rowInput">
          <UserTags details={details.tags} setDetails={setDetails} />
        </div>
        <button
          className="studyBugButton"
          form="taskForm"
          type="submit"
          disabled={isSubmitting}
        >
          {tasktoEdit ? "update task" : "create and add to course"}
        </button>
      </form>
    </div>
  );
};

interface IAppliedTag {
  tag: string;
}

const AppliedTag = (props: IAppliedTag) => {
  const { tag } = props;
  return <div className="appliedTag">{tag}</div>;
};

export default TaskForm;

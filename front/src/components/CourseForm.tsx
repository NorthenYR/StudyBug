import { useEffect, useState } from "react";
import { Course, Task } from "../models/course";
import { useForm, Controller } from "react-hook-form";
import { CourseInput } from "../network/courses_api";
import * as CourseApi from "../network/courses_api";
import TextInputField from "./form/TextInputField";

import TaskForm from "./TaskForm";
import "../styles/CourseForm.css";
import MiniTask from "./MiniTask";
import { MuiColorInput, matchIsValidColor } from "mui-color-input";
import { deleteValueByIndex } from "../utils/Utils";

interface CourseFormProps {
  coursetoEdit?: Course;
  onDismiss: () => void;
  onCourseSaved: (course: Course) => void;
}

const CourseForm = (props: CourseFormProps) => {
  const { coursetoEdit, onDismiss, onCourseSaved } = props;

  const [taskForms, setTaskForms] = useState<number>(2);
  const [phase, setPhase] = useState<number>(1);
  // const [tasks, setTasks] = useState<Task[]>(coursetoEdit?.tasks || []);
  const [tasks, setTasks] = useState<Task[]>([]);

  const getCourseTasks = async (courseId: string) => {
    const t = await CourseApi.getTasksByCourseId(courseId);
    // console.log("got task: ", t);
    setTasks(t);
  };

  useEffect(() => {
    if (coursetoEdit) {
      getCourseTasks(coursetoEdit._id);
    }
  }, []);

  const [tas, setTAs] = useState<
    { _id: string; ta_name: string; ta_email: string }[]
  >(coursetoEdit?.ta || []);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CourseInput>({
    defaultValues: {
      name: coursetoEdit?.name || "",
      code: coursetoEdit?.code || "",
      prof: coursetoEdit?.prof || {
        prof_name: "Professor",
        prof_email: "prof@prof.com",
      },
      color: coursetoEdit?.color || "",
      ta: coursetoEdit?.ta || [],
      // tasks: coursetoEdit?.tasks || [],
      tasks: tasks || [],
    },
  });

  const [details, setDetails] = useState<CourseInput>({
    name: "",
    code: "",
    prof: { prof_name: "", prof_email: "" },
    ta: [],
    color: "",
    tasks: [],
  });

  useEffect(() => {
    // console.log("tas updated: ", tas);
    setDetails({ ...details, ta: tas });
  }, [tas]);

  useEffect(() => {
    // console.log("details: ", details);
  }, [details]);

  useEffect(() => {
    // console.log("updating tasks: ", tasks);
  }, [tasks]);

  // const handleChange = (e: any) => {
  //   console.log("course form handle change running");
  //   setDetails({ ...details, [e.target.name]: e.target.value });
  // };

  const taInput = (ta: { ta_name: string; ta_email: string }, i: number) => {
    // console.log("ID BEING MAPPED: ", i);
    // console.log("TA BEING MAPPED: ", ta);
    return (
      <div className="rowInput" key={i}>
        <TextInputField
          label="TA Name"
          fullWidth
          setDetails={setDetails}
          details={details}
          value={ta.ta_name}
          setTAs={setTAs}
          className="courseTANameInput courseFormInput"
          // defaultValue={ta.ta_name}
          register={register}
          registerOptions={{ required: "Required" }}
          error={errors.prof?.prof_name}
          name={`ta[${i}].ta_name`}
          // onChange={(e: any) => handleChange(e)}
        />

        <TextInputField
          label="TA Email"
          type="email"
          fullWidth
          setDetails={setDetails}
          details={details}
          value={ta.ta_email}
          setTAs={setTAs}
          defaultValue={ta.ta_email}
          className="courseTAEmailInput courseFormInput"
          register={register}
          registerOptions={{ required: "Required" }}
          error={errors.prof?.prof_email}
          name={`ta[${i}].ta_email`}
          // onChange={(e: any) => handleChange(e)}
        />

        <button
          className="redDelete"
          onClick={(e: any) => {
            e.preventDefault();
            deleteTA(i);
          }}
        >
          x
        </button>
      </div>
    );
  };

  const removeDeletedTAs = (
    d: {
      _id: string;
      ta_name: string;
      ta_email: string;
    }[],
    i: { _id: string; ta_name: string; ta_email: string }[]
  ): { _id: string; ta_name: string; ta_email: string }[] => {
    const updatedIDs = d.map((t) => t._id);
    return i.filter((t) => updatedIDs.includes(t._id));
  };

  async function onSubmit(input: CourseInput) {
    // console.log("INPUT: ", input);
    // console.log("DETAILS: ", details);
    // console.log("TAs: ", tas);

    // probably not the best solution
    if (details.ta ? input.ta.length !== details.ta.length : false) {
      console.log("deleteing some tas");
      input = { ...input, ta: removeDeletedTAs(details.ta, input.ta) };
    }

    if (coursetoEdit) {
      input = { ...input, tasks: coursetoEdit.tasks };
    }

    try {
      let courseRes: Course;
      console.log("course to edit: ", coursetoEdit);
      if (coursetoEdit) {
        courseRes = await CourseApi.updateCourseAndTasks(
          coursetoEdit._id,
          input
        );
        // courseRes = await CourseApi.updateCourse(coursetoEdit._id, input);
      } else {
        courseRes = await CourseApi.createCourse(input);
      }
      console.log("course res: ", courseRes);
      onCourseSaved(courseRes);
    } catch (error) {
      console.log(error);
    }
  }

  async function addNewTaskToCourse(newTask: Task) {
    console.log("THE COURSE WE ARE EDITING: ", coursetoEdit);
    console.log("the new task: ", newTask);
    // coursetoEdit!.tasks.push(newTask);
    // const newtaskarr = [...coursetoEdit!.tasks, newTask];
    const newtaskarr = [...tasks, newTask];

    const newCourseTaskInput: CourseInput = {
      name: coursetoEdit!.name,
      code: coursetoEdit!.code,
      prof: coursetoEdit!.prof,
      ta: coursetoEdit!.ta,
      color: coursetoEdit!.color,
      tasks: newtaskarr,
    };
    // console.log(
    //   "the new course values should have tasks in it: ",
    //   newCourseTaskInput
    // );

    try {
      let courseRes: Course;
      console.log("course to edit: ", coursetoEdit);
      // courseRes = await CourseApi.updateCourse(
      //   coursetoEdit!._id,
      //   newCourseTaskInput
      // );

      courseRes = await CourseApi.updateCourseAndTasks(
        coursetoEdit!._id,
        newCourseTaskInput
      );
      console.log("course res: ", courseRes);
      onCourseSaved(courseRes);
      // console.log("end of try");
    } catch (error) {
      console.log(error);
    }
  }

  const handleAddTaskForm = (e: any) => {
    e.preventDefault();

    setTaskForms(taskForms + 1);
  };

  const addTA = (e: any) => {
    e.preventDefault();
    console.log("adding new ta");
    setTAs([
      ...tas,
      { _id: "", ta_name: "first last", ta_email: "example@studybug.com" },
    ]);
  };

  const deleteTA = (i: number) => {
    console.log("tas: ", tas);
    console.log("detele ta number: ", i);
    let x = deleteValueByIndex(tas, i);
    console.log("after delete: ", x);
    setTAs(x);
  };

  return (
    <div className="courseForm">
      <span className="courseFormTitle">
        {coursetoEdit ? "Edit" : "New"} Course Details:
      </span>
      <div className="closeCourseForm" onClick={onDismiss}>
        x
      </div>
      {phase === 1 && (
        <div className="phase1">
          <span className="courseFormTitle">Basics</span>
          <form
            style={{ width: "100%" }}
            id="courseForm"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="rowInput">
              <TextInputField
                fullWidth
                setDetails={setDetails}
                details={details}
                className="courseCodeInput courseFormInput"
                label="Course Code"
                register={register}
                registerOptions={{ required: "Required" }}
                error={errors.code}
                name="code"
                // onChange={(e: any) => handleChange(e)}
              />

              <Controller
                control={control}
                rules={{ validate: matchIsValidColor }}
                name="color"
                render={({ field, fieldState }) => (
                  <MuiColorInput
                    fullWidth
                    className="courseColorInput courseFormInput"
                    {...field}
                    format="hex"
                    helperText={fieldState.invalid ? "Color is invalid :(" : ""}
                    error={fieldState.invalid}
                  />
                )}
              />
            </div>

            <div className="rowInput">
              <TextInputField
                className="courseNameInput courseFormInput"
                fullWidth
                setDetails={setDetails}
                details={details}
                label="Course Name"
                register={register}
                registerOptions={{ required: "Required" }}
                error={errors.name}
                name="name"
                // onChange={(e: any) => handleChange(e)}
              />
            </div>

            <div className="rowInput">
              <TextInputField
                label="Professor Name"
                fullWidth
                setDetails={setDetails}
                details={details}
                className="courseProfNameInput courseFormInput"
                register={register}
                registerOptions={{ required: "Required" }}
                error={errors.prof?.prof_name}
                name="prof.prof_name"
                // onChange={(e: any) => handleChange(e)}
              />

              <TextInputField
                label="Professor Email"
                fullWidth
                className="courseProfEmailInput courseFormInput"
                type="email"
                setDetails={setDetails}
                details={details}
                register={register}
                registerOptions={{ required: "Required" }}
                error={errors.prof?.prof_email}
                name="prof.prof_email"
                // onChange={(e: any) => handleChange(e)}
              />
            </div>

            {tas.map((ta, i) => taInput(ta, i))}

            <button className="studyBugButton" onClick={addTA}>
              Add Teaching Assistant
            </button>
            <br />

            <button
              type="submit"
              className="studyBugButton"
              form="courseForm"
              disabled={isSubmitting}
            >
              Save Course
            </button>
          </form>
        </div>
      )}
      {phase === 2 && (
        <div className="taskForms phase2">
          <span className="courseFormTitle">Add Course Tasks</span>

          {/* {coursetoEdit?.tasks && ( */}
          {tasks && (
            <div className="allMiniTasks">
              {tasks.map((t, i) => (
                <MiniTask task={t} key={i} />
              ))}
            </div>
          )}

          {coursetoEdit && (
            <TaskForm
              course={coursetoEdit}
              deleteTaskForm={setTaskForms}
              onTaskSaved={(newTask) => {
                // update coursetoEdits task list
                // console.log("TASKS BEFORE ADDING NEW ONE: ", tasks);
                // console.log("new task, should see notes here: ", newTask);
                setTasks([...tasks, newTask]);
                addNewTaskToCourse(newTask);
              }}
            />
          )}
        </div>
      )}

      <div className="rowInput nextBackButtons">
        <button
          className="back studyBugButton"
          disabled={phase === 1}
          style={{ opacity: phase === 1 ? "0%" : "100%" }}
          onClick={() => setPhase((prev) => prev - 1)}
        >
          Back
        </button>

        {/* TODO: consider putting this back in the form so it 
        saves when they go to the next page  */}
        <button
          className="next studyBugButton"
          disabled={phase === 2 || !coursetoEdit}
          style={{ opacity: phase === 2 || !coursetoEdit ? "0%" : "100%" }}
          onClick={() => {
            setPhase((prev) => prev + 1);
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CourseForm;

import { useState, useEffect, useContext } from "react";
import CourseForm from "./CourseForm";
import { Course as CourseModel } from "../models/course";
import * as TasksApi from "../network/tasks_api";
import * as CoursesApi from "../network/courses_api";
import Course from "./Course";
import { StudyBugContext } from "../App";
import { Modal } from "@mui/material";

const CoursesLoggedIn = () => {
  const [courses, setCourses] = useState<CourseModel[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [showCoursesLoadingError, setShowCoursesLoadingError] = useState(false);
  const [showCourseForm, setShowCourseForm] = useState<boolean>(false);
  const [courseToEdit, setCourseToEdit] = useState<CourseModel | null>(null);
  const { loggedInUser } = useContext(StudyBugContext);

  useEffect(() => {
    async function loadCourses() {
      try {
        setShowCoursesLoadingError(false);
        setCoursesLoading(true);
        // console.log("RUNNING THE USE EFFECT TO GET COURSES --------------");
        const courses = await CoursesApi.fetchCourses();

        setCourses(courses);
      } catch (error) {
        console.error(error);
        setShowCoursesLoadingError(true);
      } finally {
        setCoursesLoading(false);
      }
    }
    loadCourses();
  }, []);

  useEffect(() => {
    console.log("courses updated: ", courses);
  }, [courses]);

  async function refreshCourses() {
    console.log("refreshing courses");
    const c = await CoursesApi.fetchCourses();
    setCourses(c);
  }

  async function deleteCourse(course: CourseModel) {
    console.log("deleting course");
    try {
      deleteTasksInCourse(course);
      await CoursesApi.deleteCourse(course._id);
      setCourses(courses.filter((c) => c._id !== course._id));
      console.log("course deleted");
    } catch (error) {
      console.log("err deleting course");
      console.error(error);
    }
  }

  // might be a better way to do this
  async function deleteTasksInCourse(course: CourseModel) {
    for (let task of course.tasks) {
      console.log("deleting task from course: ", task);
      try {
        await TasksApi.deleteTask(task + "");
      } catch (error) {
        console.log("err deleting task in course");
        console.error(error);
      }
    }
  }

  // useEffect(() => {
  //   console.log("show course form changed :", showCourseForm);
  // }, [showCourseForm]);

  const courseList = courses.map((course) => (
    <Course
      course={course}
      onCourseClicked={setCourseToEdit}
      onDeleteCourseClicked={deleteCourse}
      key={course._id}
    />
  ));

  return (
    <div className="coursesLoggedIn">
      <NewCourseButton
        courses={courses}
        setShowCourseForm={setShowCourseForm}
      />

      {/* to create a new course */}
      <Modal
        open={showCourseForm && !courseToEdit}
        onClose={() => setShowCourseForm(!showCourseForm)}
      >
        <CourseForm
          onDismiss={() => setShowCourseForm(false)}
          onCourseSaved={(newCourse) => {
            console.log("setting new course");
            setCourses([...courses, newCourse]);
            setShowCourseForm(false);
          }}
        />
      </Modal>

      {/* to edit an existing course */}
      <Modal open={courseToEdit !== null} onClose={() => setCourseToEdit(null)}>
        <CourseForm
          coursetoEdit={courseToEdit!}
          onDismiss={() => {
            console.log("course form dismiss");
            setCourseToEdit(null);
          }}
          onCourseSaved={(updatedCourse) => {
            // sets the users courses to be
            console.log("setting update course");
            setCourses(
              courses.map((c) =>
                c._id === updatedCourse._id ? updatedCourse : c
              )
            );
          }}
        />
      </Modal>

      {coursesLoading && <h1>LOADING...</h1>}
      {showCoursesLoadingError && (
        <h1>🐛: SOMETHING WENT WRONG, PLEASE REFRESH</h1>
      )}

      {!coursesLoading && !showCoursesLoadingError && (
        <div className="courseList">
          {courses.length > 0 ? courseList : <h1></h1>}
        </div>
      )}
    </div>
  );
};

interface NewCourseButtonProps {
  courses: CourseModel[];
  setShowCourseForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const NewCourseButton = ({
  courses,
  setShowCourseForm,
}: NewCourseButtonProps) => {
  return (
    <>
      {courses.length > 0 ? (
        <button
          className="newCoursesButtonSmall"
          onClick={() => setShowCourseForm((prev) => !prev)}
        >
          +
        </button>
      ) : (
        <div className="center">
          You haven't added any courses yet
          <br />
          <button
            className="newCoursesButtonBig"
            onClick={() => setShowCourseForm((prev) => !prev)}
          >
            Add a Course
          </button>
        </div>
      )}
    </>
  );
};

export default CoursesLoggedIn;

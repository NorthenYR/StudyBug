import { Course as CourseModel } from "../models/course";
import { CourseTaskPreview } from "./MiniTask";

interface CourseProps {
  course: CourseModel;
  onCourseClicked: (course: CourseModel) => void;
  onDeleteCourseClicked: (course: CourseModel) => void;
}

//TODO: consider using a card for this component
const Course = ({
  course,
  onCourseClicked,
  onDeleteCourseClicked,
}: CourseProps) => {
  const { name, code, color } = course;

  console.log("COURSE TASKS: ", course.tasks)

  return (
    <div
      className="course"
      style={{ backgroundColor: color }}
      onClick={() => onCourseClicked(course)}
    >
      <div className="courseDetails">
        <div className="courseDetailsLeft">
          <div className="courseDetailsCode">{code.toLocaleUpperCase()}</div>
          <div className="courseDetailsName">{name}</div>
        </div>

        <div className="courseDetailsRight">
          {course.tasks.slice(0, 2).map((t, i) => (
            <CourseTaskPreview task={t} key={i} />
          ))}
        </div>
      </div>

      <button
        className="deleteButton"
        style={{
          position: "absolute",
          top: "0px",
          right: "0px",
          margin: "0px",
        }}
        onClick={(e) => {
          onDeleteCourseClicked(course);
          e.stopPropagation();
        }}
      >
        X
      </button>
    </div>
  );
};

export default Course;

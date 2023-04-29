import CoursesLoggedIn from "../components/CoursesLoggedIn";
import CoursesLoggedOut from "../components/CoursesLoggedOut";
import { User } from "../models/user";
import { useContext } from "react";
import { StudyBugContext } from "../App";
import "../styles/courses.css"

interface CoursesPageProps {
  // TODO: add stuff here
}

const CoursesPage = ({}: // TODO: add stuff here
CoursesPageProps) => {
  const { loggedInUser } = useContext(StudyBugContext);

  return (
    <div className="coursePage mainPage">
      {loggedInUser ? <CoursesLoggedIn /> : <CoursesLoggedOut />}
    </div>
  );
};

export default CoursesPage;

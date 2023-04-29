import ReactBigCalendarLoggedIn from "../components/ReactBigCalendarLoggedIn";
import ReactBigCalendarLoggedOut from "../components/ReactBigCalendarLoggedOut";
import { useContext } from "react";
import { StudyBugContext } from "../App";

interface CalendarPageProps {
  // TODO: add stuff here
}

const CalendarPage = ({}: CalendarPageProps) => {
  const { loggedInUser } = useContext(StudyBugContext);

  return (
    <div className="calendar mainPage">
      {loggedInUser ? <ReactBigCalendarLoggedIn /> : <ReactBigCalendarLoggedOut />}
    </div>
  );
};

export default CalendarPage;

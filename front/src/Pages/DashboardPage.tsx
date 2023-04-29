import DashboardPageLoggedIn from "../components/DashboardPageLoggedIn";
import DashboardPageLoggedOut from "../components/DashboardPageLoggedOut";
import { useContext } from "react";
import { StudyBugContext } from "../App";

interface DashboardPageProps {
  // TODO: add stuff here
}

const CalendarPage = ({}: DashboardPageProps) => {
  const { loggedInUser } = useContext(StudyBugContext);
  return (
    <div className="calendar mainPage">
      {loggedInUser ? <DashboardPageLoggedIn /> : <DashboardPageLoggedOut />}
    </div>
  );
};

export default CalendarPage;

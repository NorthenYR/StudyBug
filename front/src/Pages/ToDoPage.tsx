import ToDoLoggedIn from "../components/ToDoLoggedIn";
import ToDoLoggedOut from "../components/ToDoLoggedOut";
import { useContext } from "react";
import { StudyBugContext } from "../App";

interface ToDoPageProps {
  // TODO: add stuff here
}

const TodoPage = ({}: ToDoPageProps) => {
  const { loggedInUser } = useContext(StudyBugContext);

  return (
    <div className="todo mainPage">
      {loggedInUser ? <ToDoLoggedIn /> : <ToDoLoggedOut />}
    </div>
  );
};

export default TodoPage;

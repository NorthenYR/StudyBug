/* A main function that sets up all React components of the frontend web UI. */
import { useEffect, useState, createContext } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import { User } from "./models/user";
import * as CoursesApi from "./network/courses_api";
import CoursesPage from "./Pages/CoursesPage";
import CalendarPage from "./Pages/CalendarPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFoundPage from "./Pages/NotFoundPage";
import DashboardPage from "./Pages/DashboardPage";
import TodoPage from "./Pages/ToDoPage";
import SignUpPage from "./Pages/SignUpPage";
import LoginPage from "./Pages/LoginPage";

interface IStudyBugContext {
  loggedInUser: User | null;
  setLoggedInUser: React.Dispatch<React.SetStateAction<User | null>>;
  showSignUp: boolean;
  setShowSignUp: React.Dispatch<React.SetStateAction<boolean>>;
  showLogin: boolean;
  setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
  userSettings: boolean;
  userTagsMenuOpen: boolean;
  setUserTagsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUserSettings: React.Dispatch<React.SetStateAction<boolean>>;
  fetchLoggedInUser: () => Promise<void>
}

export const StudyBugContext = createContext({} as IStudyBugContext);

function App() {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [userSettings, setUserSettings] = useState(false);
  const [userTagsMenuOpen, setUserTagsMenuOpen] = useState(false)

  useEffect(() => {
    fetchLoggedInUser();
  }, []);

  async function fetchLoggedInUser() {
    try {
      const user = await CoursesApi.getLoggedInUser();
      setLoggedInUser(user);
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <StudyBugContext.Provider
      value={{
        loggedInUser,
        setLoggedInUser,
        showSignUp,
        setShowSignUp,
        showLogin,
        userTagsMenuOpen,
        setShowLogin,
        userSettings,
        setUserTagsMenuOpen,
        setUserSettings,
        fetchLoggedInUser,
      }}
    >
      <BrowserRouter>
        <div className="App">
          <NavBar
            onLoginClicked={() => setShowLogin(true)} 
            onSignUpClicked={() => setShowSignUp(true)} 
            onLogoutSuccess={() => setLoggedInUser(null)}
          ></NavBar>

          <Routes >
            <Route path="/" element={<SignUpPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/todo" element={<TodoPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </StudyBugContext.Provider>
  );
}

export default App;

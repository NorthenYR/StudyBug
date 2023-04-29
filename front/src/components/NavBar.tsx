import { User } from "../models/user";
import NavBarLoggedIn from "./NavBarLoggedIn";
import NavBarLoggedOut from "./NavBarLoggedOut";
import { Link, useLocation } from "react-router-dom";
import "../styles/NavBar.css";
import Caterpillar from "./Caterpillar";
import { StudyBugContext } from "../App";
import { useContext } from "react";

interface NavBarProps {
  onSignUpClicked: () => void;
  onLoginClicked: () => void;
  onLogoutSuccess: () => void;
}

const NavBar = ({
  onSignUpClicked,
  onLoginClicked,
  onLogoutSuccess,
}: NavBarProps) => {
  const { loggedInUser, userSettings, setUserSettings } =
    useContext(StudyBugContext);

  const currentUrl = useLocation().pathname.slice(1);
  const pageName = currentUrl.charAt(0).toUpperCase() + currentUrl.slice(1);

  return (
      <div className="navbar">
        <div className="navlogo">
          <span>StudyBug</span>
          <span className="pageName">{pageName}</span>
        </div>
        {loggedInUser && <Caterpillar crawling={false} />}

        <div className="links">
          {loggedInUser ? (
            <>
              <Link className="navlink" to="/dashboard">
                <span>Dashboard</span>
              </Link>
              <Link className="navlink" to="/calendar">
                <span>Calendar</span>
              </Link>
              <Link className="navlink" to="/todo">
                <span>Todo</span>
              </Link>
              <Link className="navlink" to="/courses">
                <span>Courses</span>
              </Link>

              <NavBarLoggedIn
                user={loggedInUser}
                onLogoutSuccess={onLogoutSuccess}
                setUserSettings={setUserSettings}
                userSettings={userSettings}
              />
            </>
          ) : (
            <NavBarLoggedOut
              onLoginClicked={onLoginClicked}
              onSignUpClicked={onSignUpClicked}
            />
          )}
        </div>
      </div>
  );
};

export default NavBar;

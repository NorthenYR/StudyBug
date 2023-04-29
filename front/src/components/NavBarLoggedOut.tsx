import { Link } from "react-router-dom";
import { User } from "../models/user";
import * as CoursesApi from "../network/courses_api";

interface NavBarLoggedOutProps {
  onSignUpClicked: () => void;
  onLoginClicked: () => void;
}

const NavBarLoggedOut = ({
  onSignUpClicked,
  onLoginClicked,
}: NavBarLoggedOutProps) => {
  return (
    <div className="navbarloggedout">
      <Link className="tosignup" to="/signup">
        <span>Sign Up</span>
      </Link>

      <Link className="tologin" to="/login">
        <span>Log In</span>
      </Link>

      {/* <button onClick={onSignUpClicked}> SIGN UP</button>
      <button onClick={onLoginClicked}>LOG IN</button> */}
    </div>
  );
};

export default NavBarLoggedOut;

import { useContext } from "react";
import { Link } from "react-router-dom";
import { StudyBugContext } from "../App";
import LoginForm from "../components/LoginForm";
import "../styles/loginsignup.css"

const LoginPage = () => {
  const { setShowLogin, setLoggedInUser } = useContext(StudyBugContext);

  return (
    <div className="login">
      {/* <h1>LOGIN PAGE: </h1> */}
      <LoginForm
        onDismiss={() => setShowLogin(false)}
        onLoginSuccess={(user) => {
          setLoggedInUser(user);
          setShowLogin(false);
        }}
      />

      
    </div>
  );
};

export default LoginPage;

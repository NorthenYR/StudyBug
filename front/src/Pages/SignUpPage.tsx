import { useContext } from "react";
import { Link } from "react-router-dom";
import { StudyBugContext } from "../App";
import SignUpForm from "../components/SignUpForm";
import "../styles/loginsignup.css"

const SignUpPage = () => {
  const { setShowSignUp, setLoggedInUser } = useContext(StudyBugContext);

  return (
    <div className="signup">
      {/* <h1>SIGNUP PAGE: </h1> */}

      <SignUpForm
        onDismiss={() => setShowSignUp(false)}
        onSignUpSuccess={(user) => {
          setLoggedInUser(user);
          setShowSignUp(false);
        }}
      />


    </div>
  );
};

export default SignUpPage;

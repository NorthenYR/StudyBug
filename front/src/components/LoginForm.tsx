import { User } from "../models/user";
import { LoginCredentials } from "../network/courses_api";
import * as CoursesApi from "../network/courses_api";
import TextInputField from "./form/TextInputField";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { UnAuthError } from "../errors/httpsErrors";
import Caterpillar from "./Caterpillar";
import { useNavigate } from "react-router-dom";

interface LoginFormProps {
  onDismiss: () => void;
  onLoginSuccess: (user: User) => void;
}

const LoginForm = ({ onDismiss, onLoginSuccess }: LoginFormProps) => {
  const [err, setErr] = useState<string | null>(null);
  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentials>();

  async function onSubmit(credentials: LoginCredentials) {
    try {
      const newUser = await CoursesApi.login(credentials);
      onLoginSuccess(newUser);
      nav("/dashboard");
    } catch (error) {
      if (error instanceof UnAuthError) {
        console.log(error.message);
        setErr(error.message);
      } else {
        alert(error);
      }
      console.log(error);
    }
  }

  return (
    <div className="loginform">
      <Caterpillar crawling={true} />

      <h2 className="loginformtitle">Login</h2>

      {err && <h4 style={{ color: "red" }}>{err}</h4>}
      <form className="loginformform" onSubmit={handleSubmit(onSubmit)}>
        <TextInputField
          name="username"
          label="Username"
          type="text"
          placeholder="Username"
          register={register}
          registerOptions={{ required: "Required" }}
          error={errors.username}
        />

        <TextInputField
          name="password"
          label="Password"
          type="password"
          placeholder="Password"
          register={register}
          registerOptions={{ required: "Required" }}
          error={errors.password}
        />

        <button type="submit" className="loginsubmit" disabled={isSubmitting}>
          Log In
        </button>
      </form>
    </div>
  );
};

export default LoginForm;

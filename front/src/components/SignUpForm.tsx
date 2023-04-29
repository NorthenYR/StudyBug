import { useForm } from "react-hook-form";
import { User } from "../models/user";
import { SignUpCredentials } from "../network/courses_api";
import * as CoursesApi from "../network/courses_api";
import TextInputField from "./form/TextInputField";
import { useState } from "react";
import { ConflictError } from "../errors/httpsErrors";
import Caterpillar from "./Caterpillar";
import { useNavigate } from "react-router-dom";

interface SignUpFormProps {
  onDismiss: () => void;
  onSignUpSuccess: (user: User) => void;
}

const SignUpForm = ({ onDismiss, onSignUpSuccess }: SignUpFormProps) => {
  const [err, setErr] = useState<string | null>(null);
  const nav = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpCredentials>();

  async function onSubmit(credentials: SignUpCredentials) {
    try {
      const newUser = await CoursesApi.signUp(credentials);
      onSignUpSuccess(newUser);
      nav("/dashboard");
    } catch (error) {
      if (error instanceof ConflictError) {
        setErr(error.message);
      } else {
        alert(error);
      }
      console.log(error);
    }
  }
  return (
    <div className="signupform">
      <Caterpillar  crawling={true} />

      <h2 className="signupformtitle">Sign Up</h2>

      {err && <h4 style={{ color: "red" }}>{err}</h4>}

      <form className="signupformform" onSubmit={handleSubmit(onSubmit)}>
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
          name="email"
          label="Email"
          type="email"
          placeholder="Email"
          register={register}
          registerOptions={{ required: "Required" }}
          error={errors.email}
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
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;

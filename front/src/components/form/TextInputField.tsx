import { TextField } from "@mui/material";
import { useEffect } from "react";
import { RegisterOptions, UseFormRegister, FieldError } from "react-hook-form";
import { CourseInput } from "../../network/courses_api";

interface TextInputFieldProps {
  name: string;
  label: string;
  register: UseFormRegister<any>;
  registerOptions?: RegisterOptions;
  error?: FieldError;
  [x: string]: any;
}

const TextInputField = ({
  name,
  label,
  register,
  registerOptions,
  setDetails,
  error,
  value,
  details,
  tas,
  setTAs,
  ...props
}: TextInputFieldProps) => {
  // this can probably be simplified
  const getID = (str: string): number => {
    const regex = /^ta\[(\d+)\]\./;
    const match = str.match(regex);

    if (match) {
      return parseInt(match[1]);
    } else {
      return -1;
    }
  };

  const nameOrEmail = (str: string): "ta_email" | "ta_name" | "" => {
    const regex = /^ta\[\d+\]\.(ta_email|ta_name)$/;
    const match = str.match(regex);
    if (match) {
      return match[1] as "ta_email" | "ta_name";
    } else {
      return "";
    }
  };

  const updateDetails = (e: any) => {
    // console.log("updating task details INNER: ", e.target.value);
    // console.log("TARGETNAME: ", e.target.name, "TARGETVALUE: ", e.target.value);
    if (setDetails) {
      if (e.target.name.substring(0, 2) === "ta") {
        let taID = getID(e.target.name);
        let valType = nameOrEmail(e.target.name);

        setDetails((prevDetails: CourseInput) => {
          const updatedTA = {
            ...prevDetails.ta[taID],
            [valType]: e.target.value,
          };
          const updatedTAs = [...prevDetails.ta];

          updatedTAs[taID] = updatedTA;
          setTAs(updatedTAs)
          return { ...prevDetails, ta: updatedTAs };
        });

      } else {
        // why did i pass details here, could have used prev, review
        setDetails({ ...details, [e.target.name]: e.target.value });
      }
    }
  };

  return (
    <TextField
      InputProps={{
        className: "textinputfield",
      }}
      label={label}
      {...props}
      {...register(name, registerOptions)}
      name={name}
      value={value}
      error={!!error}
      onChange={updateDetails}
    />
  );
};

export default TextInputField;

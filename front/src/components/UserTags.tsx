import "../styles/TaskForm.css";
import { User } from "../models/user";
import { useContext, useEffect, useState } from "react";
import { StudyBugContext } from "../App";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import * as CourseApi from "../network/courses_api";
import { UserInput } from "../network/courses_api";
import { replaceStringInArray, updateArrayWithNewString } from "../utils/Utils";
import { IDetails } from "./TaskForm";
import { Check, Delete, Edit, Save } from "@mui/icons-material";
import TextInputField from "./form/TextInputField";
import Task from "./Task";
// need to display all the user tags as a checklist
// make the req to update the user here also
// make or import the type for details

interface UserTagProps {
  tag: string;
  // TODO: should probably change the type of these alltogether but just going to make them optional for now
  mytags: string[];
  refreshUserTags?: boolean;
  setRefresh?: React.Dispatch<React.SetStateAction<boolean>>;
  setDetails?: React.Dispatch<React.SetStateAction<IDetails>>;
}
const UserTag = (props: UserTagProps) => {
  const { mytags, setDetails, tag, setRefresh, refreshUserTags } = props;

  const { loggedInUser, fetchLoggedInUser } = useContext(StudyBugContext);

  const [check, setCheck] = useState<boolean>(
    mytags.includes(tag) ? true : false
  );

  const [editTag, setEditTag] = useState<string>(tag);

  useEffect(() => {
    setCheck(mytags.includes(tag) ? true : false);
  }, [mytags]);

  useEffect(() => {
    // console.log("edit tag: ", editTag);
    // console.log("tag: ", tag);
    setEditTag(tag);
  }, [tag]);

  const handleUserTag = () => {
    // if its in the tags list, remove it, if it's not add it
    // input = { ...input, ta: removeDeletedTAs(details.ta, input.ta) };
    console.log("user tag toggled: ", tag);

    if (setDetails) {
      setDetails((prev) => ({
        ...prev,
        tags: updateArrayWithNewString(mytags, tag),
      }));
    }
  };

  async function handleDeleteUserTag() {
    console.log(`deleting tag: ${tag}, editTag is: ${editTag}`);

    let input: UserInput = {
      username: loggedInUser!.username,
      email: loggedInUser!.email,
      allTags: loggedInUser!.allTags.filter((t) => t !== tag),
    };

    try {
      let userRes: User;
      userRes = await CourseApi.updateUser(loggedInUser!._id, input);
      console.log("user res: ", userRes);
      fetchLoggedInUser();
    } catch (error) {
      console.log("err deleting user tag: ", error);
    } finally {
      if (setRefresh) {
        setRefresh(!refreshUserTags);
      }
    }

    if (setRefresh && refreshUserTags) {
      setRefresh(!refreshUserTags);
    }
  }

  async function handleEditUserTag() {
    // TODO: need to update all tasks w the tag here too.
    console.log(`changing tag from: ${tag} to ${editTag}`);

    let input: UserInput = {
      username: loggedInUser!.username,
      email: loggedInUser!.email,
      allTags: replaceStringInArray(loggedInUser!.allTags, tag, editTag),
    };

    try {
      let userRes: User;
      userRes = await CourseApi.updateUser(loggedInUser!._id, input);

      console.log("user res: ", userRes);
      fetchLoggedInUser();
    } catch (error) {
      console.log("err editing user tag: ", error);
    }
  }

  return (
    <div className="userTag">
      {setDetails && (
        <FormControlLabel
          control={<Checkbox onChange={handleUserTag} checked={check} />}
          label={tag}
        />
      )}

      {!setDetails && (
        <div className="modifyUserTag">
          <div className="deleteUserTag" onClick={handleDeleteUserTag}>
            <Delete />
          </div>
          {/* <span>{tag}</span> */}
          <TextField
            label={editTag}
            value={editTag}
            onChange={(e) => setEditTag(e.target.value)}
          />

          {/* need to add some pop up or something when this saves */}
          <div className="editUserTag" onClick={handleEditUserTag}>
            {/* <Edit /> */}
            <Save/>
          </div>
        </div>
      )}
    </div>
  );
};

interface IUserTags {
  details: string[];
  setDetails?: React.Dispatch<React.SetStateAction<IDetails>>;
}

const UserTags = (props: IUserTags) => {
  const { details, setDetails } = props;
  const { loggedInUser, fetchLoggedInUser } = useContext(StudyBugContext);

  const [allUserTags, setAllUserTags] = useState<string[]>(
    loggedInUser!.allTags
  );

  // TODO: double check if this is really needed
  const [refreshUserTags, setRefreshUserTags] = useState<boolean>(true);

  useEffect(() => {
    console.log("user tags  updated");
  }, [allUserTags]);

  useEffect(() => {
    console.log("logged in user changed");
    console.log("allTAgs: ", loggedInUser!.allTags);
    setAllUserTags(loggedInUser!.allTags);
  }, [loggedInUser]);

  const [newTag, setNewTag] = useState<string>("");

  async function handleAddNewUserTag() {
    console.log("adding new user tag: ", newTag);

    let input: UserInput = {
      username: loggedInUser!.username,
      email: loggedInUser!.email,
      allTags: [...loggedInUser!.allTags, newTag],
    };

    try {
      let userRes: User;
      userRes = await CourseApi.updateUser(loggedInUser!._id, input);

      console.log("user res: ", userRes);
      //   onCourseSaved(courseRes);
      fetchLoggedInUser();
    } catch (error) {
      console.log("err adding new user tag: ", error);
    }
  }

  return (
    <div className="userTags">
      <div className="allUserTags">
        <FormGroup>
          {allUserTags.map((t, i) => (
            <UserTag
              key={i}
              tag={t}
              mytags={details}
              setDetails={setDetails}
              refreshUserTags={refreshUserTags}
              setRefresh={setRefreshUserTags}
            />
          ))}
        </FormGroup>
      </div>

      <div className="userTagsInput">
        <TextField
          fullWidth
          label="Create New Tag"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
        />
        <button className="addNewUserTagButton" onClick={handleAddNewUserTag}>
          <Check />
        </button>
      </div>
    </div>
  );
};

export default UserTags;

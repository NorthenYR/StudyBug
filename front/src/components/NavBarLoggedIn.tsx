import { User } from "../models/user";
import * as CoursesApi from "../network/courses_api";
import { Drawer, MenuItem, Modal, Typography } from "@mui/material";
import { useState, useContext, useEffect } from "react";
import UserTags from "./UserTags";
import { StudyBugContext } from "../App";

interface NavBarLoggedInProps {
  user: User;
  onLogoutSuccess: () => void;
  userSettings: boolean;
  setUserSettings: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavBarLoggedIn = ({
  user,
  onLogoutSuccess,
  setUserSettings,
  userSettings,
}: NavBarLoggedInProps) => {
  const [showUserTags, setShowUserTags] = useState<boolean>(false);
  let { setUserTagsMenuOpen } = useContext(StudyBugContext);

  async function logout() {
    try {
      await CoursesApi.logout();
      onLogoutSuccess();
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }

  // TODO: would make more sense to swap these... 
  useEffect(() => {
    setUserTagsMenuOpen(showUserTags)
  }, [showUserTags])

  return (
    <div className="navbarloggedin">
      <div className="userIcon" onClick={() => setUserSettings(true)}>
        {user.username[0].toUpperCase()}
      </div>

      <Modal open={showUserTags} onClose={() => setShowUserTags(false)}>
        <div className="userTagsMenu">
          <span>Edit User Tags:</span>
          <UserTags details={[]} />
        </div>
      </Modal>

      <Drawer
        anchor={"right"}
        className="settings"
        open={userSettings}
        PaperProps={{
          sx: { width: "300px" },
        }}
        onClose={() => {
          setUserSettings(false);
        }}
      >
        <div className="settingsTitle">Settings</div>

        <MenuItem>Account Settings</MenuItem>
        <MenuItem onClick={() => setShowUserTags(true)}>User Tags</MenuItem>
        <MenuItem onClick={logout}>Log Out</MenuItem>
      </Drawer>
    </div>
  );
};

export default NavBarLoggedIn;

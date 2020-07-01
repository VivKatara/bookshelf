import axios from "axios";
import { User } from "../types/User";
import { SET_USER, LOG_OFF_USER, AppActions } from "../types/actions";
import { Dispatch } from "redux";

import { checkAccessAndRefreshToken } from "../utils/authMiddleware";

export const setUser = (data: User): AppActions => ({
  type: SET_USER,
  payload: {
    userFullName: data.userFullName,
    username: data.username,
    isLoggedIn: data.isLoggedIn,
  },
});

export const logOffUser = (): AppActions => ({
  type: LOG_OFF_USER,
});

export const startSetUser = () => async (
  dispatch: Dispatch<AppActions>
): Promise<void> => {
  try {
    const method: string = "GET";
    const url: string = "http://localhost:5000/user/profile";
    const data: any = {};
    const config: any = { withCredentials: true, validateStatus: false };
    const error: string = "User is not logged in";
    const response = await checkAccessAndRefreshToken(
      method,
      url,
      data,
      config,
      error
    );
    const {
      userFullName,
      username,
    }: { userFullName: string; username: string } = response.data.user;
    const setUserData = { userFullName, username, isLoggedIn: true };
    dispatch(setUser(setUserData));
  } catch (error) {
    console.log(error.message);
    const setUserData = { userFullName: "", username: "", isLoggedIn: false };
    dispatch(setUser(setUserData));
  }
};

export const startLogOffUser = () => async (
  dispatch: Dispatch<AppActions>
): Promise<void> => {
  // Call the backend logout
  await axios.delete("http://localhost:5000/auth/logout", {
    withCredentials: true,
  });
  dispatch(logOffUser());
};

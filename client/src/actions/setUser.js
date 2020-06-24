import axios from "axios";
import { SET_USER, LOG_OFF_USER } from "./types";

import { checkAccessAndRefreshToken } from "../utils/authMiddleware";

export const setUser = () => async (dispatch) => {
  try {
    const method = "GET";
    const url = "http://localhost:5000/profile";
    const data = {};
    const config = { withCredentials: true, validateStatus: false };
    const error = "User is not logged in.";
    const response = await checkAccessAndRefreshToken(
      method,
      url,
      data,
      config,
      error
    );
    // if this doesn't end up in the catch block, it must be a success
    const action = {
      type: SET_USER,
      payload: {
        userFullName: response.data.user.fullName,
        username: response.data.user.username,
        isLoggedIn: true,
      },
    };
    dispatch(action);
  } catch (error) {
    console.log(error.message);
    const action = {
      type: SET_USER,
      payload: {
        userFullName: "",
        username: "",
        isLoggedIn: false,
      },
    };
    dispatch(action);
  }
};

export const logOffUser = () => async (dispatch) => {
  // Call the backend logout
  await axios.delete("http://localhost:5000/auth/logout", {
    withCredentials: true,
  });
  const action = {
    type: LOG_OFF_USER,
  };
  dispatch(action);
};

import axios from "axios";
import { SET_USER, LOG_OFF_USER } from "./types";

export const setUser = () => async (dispatch) => {
  try {
    // you will have to use the frontend middleware here in case the access token passed in has expired and refresh token is necessary
    const response = await axios.get("http://localhost:5000/profile", {
      withCredentials: true,
    });
    const action = {
      type: SET_USER,
      payload: {
        userName: response.data.user.name,
        isLoggedIn: true,
      },
    };
    dispatch(action);
  } catch (e) {
    console.log(
      "Error occurred while trying to set user profile. User must not be logged in"
    );
    console.log(e);
    const action = {
      type: SET_USER,
      payload: {
        userName: "",
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

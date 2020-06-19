import axios from "axios";
import { SET_USER, LOG_OFF_USER } from "./types";

export const setUser = () => async (dispatch) => {
  // TODO Implement a check here that also htis the refresh token route if authenticatetoken middleware returns an error
  try {
    let response = await axios.get("http://localhost:5000/profile", {
      withCredentials: true,
      validateStatus: false,
    });
    if (response.status !== 200) {
      if (response.status === 401)
        throw new Error("Attempt to access profile without access token");
      else if (response.status === 403) {
        // If there is an error on this route, it will automatically jump to
        // catch block since validateStatus isn't explicilty set
        await axios.get("http://localhost:5000/auth/token", {
          withCredentials: true,
        });

        // Retry with new access token
        response = await axios.get("http://localhost:5000/profile", {
          withCredentials: true,
          validateStatus: false,
        });
      }
    }

    if (response.status === 200) {
      const action = {
        type: SET_USER,
        payload: {
          userFullName: response.data.user.fullName,
          username: response.data.user.username,
          isLoggedIn: true,
        },
      };
      dispatch(action);
    } else {
      throw new Error("Failure to access profile");
    }
  } catch (error) {
    // TODO Before Throwing error here, use the refreshtoken route
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

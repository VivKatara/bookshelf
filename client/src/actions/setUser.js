import axios from "axios";
import { SET_USER } from "./types";

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

  // axios
  //   .get("http://localhost:5000/profile", {
  //     withCredentials: true,
  //     // Don't forget to pass validateStatus as false as you refactor in the middleware
  //   })
  //   .then((res) => {
  //     const action = {
  //       type: GET_USER,
  //       payload: {
  //         userName: res.data.user.name,
  //       },
  //     };
  //     dispatch(action);
  //   })
  //   .catch((err) => console.log(err));
};

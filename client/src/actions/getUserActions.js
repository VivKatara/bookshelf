import axios from "axios";
import { GET_USER } from "./types";

export const getUser = () => (dispatch) => {
  axios
    .get("http://localhost:5000/profile", {
      withCredentials: true,
      // Don't forget to pass validateStatus as false as you refactor in the middleware
    })
    .then((res) => {
      const action = {
        type: GET_USER,
        payload: {
          userName: res.data.user.name,
        },
      };
      dispatch(action);
    })
    .catch((err) => console.log(err));
};

import { SET_USER, LOG_OFF_USER } from "../actions/types";

const initialState = {
  userFullName: "",
  username: "",
  isLoggedIn: false,
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      const { userFullName, username, isLoggedIn } = action.payload;
      return {
        ...state,
        userFullName,
        username,
        isLoggedIn,
      };
    case LOG_OFF_USER:
      return {
        ...state,
        userFullName: "",
        username: "",
        isLoggedIn: false,
      };
    default:
      return state;
  }
}

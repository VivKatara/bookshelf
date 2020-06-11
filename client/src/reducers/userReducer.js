import { SET_USER, LOG_OFF_USER } from "../actions/types";

const initialState = {
  userName: "",
  isLoggedIn: false,
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      const { userName, isLoggedIn } = action.payload;
      return {
        ...state,
        userName,
        isLoggedIn,
      };
    case LOG_OFF_USER:
      return {
        ...state,
        userName: "",
        isLoggedIn: false,
      };
    default:
      return state;
  }
}

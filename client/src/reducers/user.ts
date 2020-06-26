import { SET_USER, LOG_OFF_USER, UserActionTypes } from "../types/actions";
import { User } from "../types/User";

const initialState: User = {
  userFullName: "",
  username: "",
  isLoggedIn: false,
};

export default function userReducer(
  state = initialState,
  action: UserActionTypes
): User {
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

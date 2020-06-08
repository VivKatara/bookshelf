import { GET_USER } from "../actions/types";

const initialState = {
  userName: "",
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case GET_USER:
      return {
        ...state,
        userName: action.payload.userName,
      };
    default:
      return state;
  }
}

import { useReducer } from "react";

const initialState = {
  error: false,
  errorMsg: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SUCCESS":
      return {
        ...state,
        error: false,
        errorMsg: "",
      };
    case "FAIL":
      return {
        ...state,
        error: true,
        errorMsg: action.payload.errorMsg,
      };
  }
};

export function useErrorMessage() {
  const [errorState, dispatchError] = useReducer(reducer, initialState);
  return [errorState, dispatchError];
}

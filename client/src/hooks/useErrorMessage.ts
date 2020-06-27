import { useReducer } from "react";
import { ErrorMessageState, ErrorMessageHook } from "../types/ErrorMessageHook";
import { ErrorMessageHookActionTypes } from "../types/actions";

const initialState: ErrorMessageState = {
  error: false,
  errorMsg: "",
};

const reducer = (
  state: ErrorMessageState,
  action: ErrorMessageHookActionTypes
) => {
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
        errorMsg: action.payload!.errorMsg,
      };
    default:
      return state;
  }
};

export const useErrorMessage = (): ErrorMessageHook => {
  const [errorState, dispatchError] = useReducer(reducer, initialState);
  return [errorState, dispatchError];
};

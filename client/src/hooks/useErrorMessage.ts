import { useReducer } from "react";
import { ErrorMessageState, ErrorMessageHook } from "../types/hooks";
import { ErrorMessageHookActionTypes, SUCCESS, FAIL } from "../types/actions";
import { getError } from "../errors";

const initialState: ErrorMessageState = {
  error: false,
  errorMsg: "",
};

const reducer = (
  state: ErrorMessageState,
  action: ErrorMessageHookActionTypes
): ErrorMessageState => {
  switch (action.type) {
    case SUCCESS:
      return {
        ...state,
        error: false,
        errorMsg: "",
      };
    case FAIL:
      return {
        ...state,
        error: true,
        errorMsg: parseGraphQLError(action.payload!.errorMsg),
      };
    default:
      return state;
  }
};

export const useErrorMessage = (): ErrorMessageHook => {
  const [errorState, dispatchError] = useReducer(reducer, initialState);
  return [errorState, dispatchError];
};

const parseGraphQLError = (errorMsg: string): string => {
  const parsedError = errorMsg.split(": ");
  return getError(parsedError[1]);
};

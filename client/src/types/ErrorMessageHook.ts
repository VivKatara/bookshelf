import { Dispatch } from "react";
import { ErrorMessageHookActionTypes } from "./actions";

export interface ErrorMessageState {
  error: boolean;
  errorMsg: string;
}

export type ErrorMessageHook = [
  ErrorMessageState,
  Dispatch<ErrorMessageHookActionTypes>
];

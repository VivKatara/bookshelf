import { Dispatch } from "react";

export interface ErrorMessageState {
  error: boolean;
  errorMsg: string;
}

export interface SuccessAction {
  type: string;
  payload: null;
}

export interface FailAction {
  type: string;
  payload: { errorMsg: string };
}

export type ErrorMessageHookActions = SuccessAction | FailAction;

export type ErrorMessageHook = [
  ErrorMessageState,
  Dispatch<ErrorMessageHookActions>
];

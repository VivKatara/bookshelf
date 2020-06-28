import { Dispatch } from "react";
import { ErrorMessageHookActionTypes } from "./actions";

export type ModalDisplayHook = [boolean, () => void];
export type BookModalUpdatesHook = [number, () => void];

export interface ErrorMessageState {
  error: boolean;
  errorMsg: string;
}

export type ErrorMessageHook = [
  ErrorMessageState,
  Dispatch<ErrorMessageHookActionTypes>
];

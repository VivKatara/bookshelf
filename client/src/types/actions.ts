import { User } from "./User";

export const SET_USER = "SET_USER";
export const LOG_OFF_USER = "LOG_OFF_USER";

export interface SetUserAction {
  type: typeof SET_USER;
  payload: User;
}

export interface LogOffAction {
  type: typeof LOG_OFF_USER;
}

export type UserActionTypes = SetUserAction | LogOffAction;

export type AppActions = UserActionTypes;

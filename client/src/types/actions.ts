import { User } from "./User";

export const SET_USER = "SET_USER";
export const LOG_OFF_USER = "LOG_OFF_USER";

// Redux User Actions
export interface SetUserAction {
  type: typeof SET_USER;
  payload: User;
}

export interface LogOffAction {
  type: typeof LOG_OFF_USER;
}

export type UserActionTypes = SetUserAction | LogOffAction;

// Homepage Isbn Reducer Actions
export const UPDATE_CURRENT = "UPDATE_CURRENT";
export const UPDATE_PAST = "UPDATE_PAST";
export const UPDATE_FUTURE = "UPDATE_FUTURE";

export type HomepageIsbnType =
  | typeof UPDATE_CURRENT
  | typeof UPDATE_PAST
  | typeof UPDATE_FUTURE;

export interface HomepageUpdateIsbnsAction {
  type: HomepageIsbnType;
  payload: { isbns: Array<string> };
}

export type HomepageIsbnsActionTypes = HomepageUpdateIsbnsAction;

// All actions aggregator
export type AppActions = UserActionTypes | HomepageIsbnsActionTypes;

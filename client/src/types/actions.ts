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

// Homepage Reducer Actions
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

export type HomepageActionTypes = HomepageUpdateIsbnsAction;

// FullShelf Reducer Actions
export const UPDATE_ISBNS = "UPDATE_ISBNS";
export const PAGE_MOUNT = "PAGE_MOUNT";

export interface FullShelfUpdateIsbnsAction {
  type: typeof UPDATE_ISBNS;
  payload: {
    firstShelf: Array<string>;
    secondShelf: Array<string>;
    thirdShelf: Array<string>;
  };
}

export interface FullShelfPageMountAction {
  type: typeof PAGE_MOUNT;
  payload: {
    totalPages: number;
    showPrevious: boolean;
    showNext: boolean;
    showPageCount: boolean;
  };
}

export type FullShelfActionTypes =
  | FullShelfUpdateIsbnsAction
  | FullShelfPageMountAction;

// Book Reducer Actions
export const FOUND_BOOK = "FOUND_BOOK";

export interface BookFoundBookAction {
  type: typeof FOUND_BOOK;
  payload: {
    foundBook: boolean;
    title: string;
    authors: string;
    description: string;
    coverImage: string;
  };
}

export type BookActionTypes = BookFoundBookAction;

// Error Message Hook Reducer Actions
export const SUCCESS = "SUCCESS";
export const FAIL = "FAIL";

export interface SuccessAction {
  type: typeof SUCCESS;
}

export interface FailAction {
  type: typeof FAIL;
  payload: { errorMsg: string };
}

export type ErrorMessageHookActionTypes = SuccessAction | FailAction;

// All actions aggregator - mainly used for Redux Thunk Dispatch
export type AppActions =
  | UserActionTypes
  | HomepageActionTypes
  | FullShelfActionTypes
  | ErrorMessageHookActionTypes;

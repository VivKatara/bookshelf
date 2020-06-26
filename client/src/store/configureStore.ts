import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk, { ThunkMiddleware } from "redux-thunk";
import userReducer from "../reducers/user";
import { AppActions } from "../types/actions";

export const rootReducer = combineReducers({
  userState: userReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

const initialState = {};

const middleware = [thunk as ThunkMiddleware<AppState, AppActions>];

const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(...middleware)
  // compose(
  //   applyMiddleware(...middleware),
  //   window.__REDUX_DEVTOOLS_EXTENSION__ &&
  //     window.__REDUX_DEVTOOLS_EXTENSION__(),
  // ),
);

export default store;

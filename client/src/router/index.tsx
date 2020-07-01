import React, { useState, useEffect, FunctionComponent } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { connect } from "react-redux";

import PrivateRouter from "./PrivateRouter";
import AuthRouter from "./AuthRouter";
import Loading from "../components/Loading";

import { startSetUser } from "../actions/user";
import { User } from "../types/User";
import { AppState } from "../store/configureStore";
import { ThunkDispatch } from "redux-thunk";
import { AppActions } from "../types/actions";
import { bindActionCreators } from "redux";

type AppRouterProps = {};
type Props = AppRouterProps & LinkStateProps & LinkDispatchProps;

const AppRouter: FunctionComponent<Props> = (props) => {
  const { userFullName, username, isLoggedIn } = props.user;
  const { startSetUser } = props;

  // This state is essential such that we're not updating the state of an unmounted React component
  // Which could occur in the Homepage of PrivateRoutes since isLoggedIn always defaults to false before setUser is called
  const [userSet, setUserSet] = useState(false);

  useEffect(() => {
    async function setUserOnMount(): Promise<void> {
      await startSetUser();
      setUserSet(true);
    }
    setUserOnMount();
  }, [userSet]);

  if (userSet) {
    return (
      <Router>
        {isLoggedIn ? (
          <PrivateRouter userFullName={userFullName} username={username} />
        ) : (
          <AuthRouter />
        )}
      </Router>
    );
  } else return <Loading />;
};

type LinkStateProps = {
  user: User;
};

type LinkDispatchProps = {
  startSetUser: () => void;
};

const mapStateToProps = (
  state: AppState,
  ownProps: AppRouterProps
): LinkStateProps => ({
  user: state.userState,
});
const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>,
  ownProps: AppRouterProps
): LinkDispatchProps => ({
  startSetUser: bindActionCreators(startSetUser, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppRouter);

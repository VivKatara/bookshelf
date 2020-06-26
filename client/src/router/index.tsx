import React, { useState, useEffect } from "react";
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

interface AppRouterProps {}
type Props = AppRouterProps & LinkStateProps & LinkDispatchProps;

const AppRouter: React.FC<Props> = (props) => {
  const { userFullName, username, isLoggedIn } = props.user;
  const { startSetUser } = props;

  // This state is essential such that we're not updating the state of an unmounted React component
  // Which could occur in the Homepage of PrivateRoutes since isLoggedIn always defaults to false before setUser is called
  const [userSet, setUserSet] = useState(false);

  useEffect(() => {
    async function setUserOnMount() {
      await startSetUser();
      setUserSet(true);
    }
    setUserOnMount();
  }, [userSet]);

  console.log("Routing");
  console.log(props.user);

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

interface LinkStateProps {
  user: User;
}

interface LinkDispatchProps {
  startSetUser: () => void;
}

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

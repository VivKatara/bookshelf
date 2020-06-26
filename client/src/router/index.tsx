import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { connect } from "react-redux";

import PrivateRouter from "./PrivateRouter";
import AuthRouter from "./AuthRouter";

// import LoggedInHeader from "../components/headers/LoggedInHeader";
// import Homepage from "../components/Homepage";
// import FullShelf from "../components/FullShelf";
// import LandingPage from "../components/LandingPage";
// import Login from "../components/Login";
// import Register from "../components/Register";
import Loading from "../components/Loading";
// import NotFound from "../components/NotFound";

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

  if (userSet) {
    return (
      <Router>
        {isLoggedIn ? <PrivateRouter username={username} /> : <AuthRouter />}
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

// interface PrivateProps {
//   username: string;
// }

// const PrivateRoutes: React.FC<PrivateProps> = (props) => {
//   return (
//     <>
//       <LoggedInHeader />
//       <Switch>
//         <Redirect exact from="/" to={`/${props.username}`} />
//         <Redirect exact from="/login" to={`/${props.username}`} />
//         <Redirect exact from="/register" to={`/${props.username}`} />
//         <Route exact path={"/:username"} component={Homepage} />
//         <Route exact path="/:username/shelf/:type" component={FullShelf} />
//         <Route path="*" component={NotFound} />
//       </Switch>
//     </>
//   );
// };

// interface AuthProps {}

// const AuthRoutes: React.FC<AuthProps> = (props) => {
//   return (
//     <>
//       <Switch>
//         <Route exact path="/" component={LandingPage} />
//         <Route exact path="/login" component={Login} />
//         <Route exact path="/register" component={Register} />
//         <Route exact path={"/:username"} component={Homepage} />
//         <Route exact path="/:username/shelf/:type" component={FullShelf} />
//         <Route path="*" component={NotFound} />
//       </Switch>
//     </>
//   );
// };

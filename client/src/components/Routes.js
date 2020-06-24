import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { connect } from "react-redux";

import LoggedInHeader from "./headers/LoggedInHeader";
import Homepage from "./Homepage";
import FullShelf from "./FullShelf";
import LandingPage from "./LandingPage";
import Login from "./Login";
import Register from "./Register";
import Loading from "./Loading";
import NotFound from "./NotFound";

import { setUser } from "../actions/setUser";

const Routes = (props) => {
  const { isLoggedIn, username, setUser } = props;

  // This state is essential such that we're not updating the state of an unmounted React component
  // Which could occur in the Homepage of PrivateRoutes since isLoggedIn always defaults to false before setUser is called
  const [userSet, setUserSet] = useState(false);

  useEffect(() => {
    async function setUserOnMount() {
      await setUser();
      setUserSet(true);
    }
    setUserOnMount();
  }, []);
  if (userSet) {
    return (
      <Router>
        {isLoggedIn ? <PrivateRoutes username={username} /> : <AuthRoutes />}
      </Router>
    );
  } else {
    return <Loading />;
  }
};

const mapStateToProps = (state) => ({
  isLoggedIn: state.userState.isLoggedIn,
  username: state.userState.username,
});

Routes.propTypes = {
  setUser: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
};

export default connect(mapStateToProps, { setUser })(Routes);

const PrivateRoutes = (props) => {
  return (
    <>
      <LoggedInHeader />
      <Switch>
        <Redirect exact from="/" to={`/${props.username}`} />
        <Redirect exact from="/login" to={`/${props.username}`} />
        <Redirect exact from="/register" to={`/${props.username}`} />
        <Route exact path={"/:username"} component={Homepage} />
        <Route exact path="/:username/shelf/:type" component={FullShelf} />
        <Route path="*" component={NotFound} />
      </Switch>
    </>
  );
};

const AuthRoutes = () => {
  console.log("Somehow here in auth");
  return (
    <>
      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path={"/:username"} component={Homepage} />
        <Route exact path="/:username/shelf/:type" component={FullShelf} />
        <Route path="*" component={NotFound} />
      </Switch>
    </>
  );
};

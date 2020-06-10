import React, { useEffect } from "react";
import PropTypes from "prop-types";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { connect } from "react-redux";
import Header from "./Header";
import Homepage from "./Homepage";
import FullShelf from "./FullShelf";
import LandingPage from "./LandingPage";
import Login from "./Login";
import Register from "./Register";
import { setUser } from "../actions/setUser";

const Routes = (props) => {
  const { isLoggedIn, setUser } = props;
  useEffect(() => {
    setUser();
  }, []);
  return <Router>{isLoggedIn ? <PrivateRoutes /> : <AuthRoutes />}</Router>;
};

const mapStateToProps = (state) => ({
  isLoggedIn: state.userState.isLoggedIn,
});

Routes.propTypes = {
  setUser: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, { setUser })(Routes);

const PrivateRoutes = () => {
  return (
    <>
      <Header />
      <Switch>
        <Redirect exact from="/" to="/home" />
        <Redirect exact from="/login" to="/home" />
        <Redirect exact from="/register" to="/home" />
        <Route exact path={"/home"} component={Homepage} />
        <Route exact path="/shelf" component={FullShelf} />
        {/* <Route path="*" component={NotFoundPage} /> */}
      </Switch>
    </>
  );
};

const AuthRoutes = () => {
  return (
    <>
      <Switch>
        <Redirect exact from="/home" to="/" />
        <Route exact path="/" component={LandingPage} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        {/* <Route path="*" component={NotFoundPage} /> */}
      </Switch>
    </>
  );
};

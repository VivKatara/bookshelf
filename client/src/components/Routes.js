import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import Homepage from "./Homepage";
import Login from "./Login";
import Register from "./Register";
import FullShelf from "./FullShelf";

function Routes() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route exact path="/home" component={Homepage} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/home/currentBooks" component={FullShelf} />
      </Switch>
    </Router>
  );
}

export default Routes;

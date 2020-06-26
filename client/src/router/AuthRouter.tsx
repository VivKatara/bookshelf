import React from "react";
import { Switch, Route } from "react-router-dom";

import LandingPage from "../components/LandingPage";
import Login from "../components/Login";
import Register from "../components/Register";
import Homepage from "../components/Homepage";
import FullShelf from "../components/FullShelf";
import NotFound from "../components/NotFound";

interface AuthProps {}

const AuthRouter: React.FC<AuthProps> = (props) => {
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

export default AuthRouter;

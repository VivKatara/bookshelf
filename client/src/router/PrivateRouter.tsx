import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import LoggedInHeader from "../components/headers/LoggedInHeader";
import Homepage from "../components/Homepage";
import FullShelf from "../components/FullShelf";
import NotFound from "../components/NotFound";

interface PrivateProps {
  userFullName: string;
  username: string;
}

const PrivateRouter: React.FC<PrivateProps> = (props) => {
  const { userFullName, username } = props;
  return (
    <>
      <LoggedInHeader userFullName={userFullName} />
      <Switch>
        <Redirect exact from="/" to={`/${username}`} />
        <Redirect exact from="/login" to={`/${username}`} />
        <Redirect exact from="/register" to={`/${username}`} />
        <Route exact path={"/:username"} component={Homepage} />
        <Route exact path="/:username/shelf/:type" component={FullShelf} />
        <Route path="*" component={NotFound} />
      </Switch>
    </>
  );
};

export default PrivateRouter;

import React, { FunctionComponent } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import LoggedInHeader from "../components/headers/LoggedInHeader";
import Homepage from "../components/Homepage";
import FullShelf from "../components/FullShelf";
import NotFound from "../components/NotFound";

type Props = {
  userFullName: string;
  username: string;
};

const PrivateRouter: FunctionComponent<Props> = (props) => {
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

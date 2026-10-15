// src/routes/Routes.jsx
import React from "react";
import { Route, Switch } from "react-router-dom";

import Home from "../pages/Home";
import Catalog from "../pages/Catalog";
import Detail from "../pages/detail/Detail";
import SignIn from "../pages/SignIn";
import Register from "../pages/Register";
import Preferences from "../pages/Preferences";

import * as Config from "../constants/Config";

const Routes = () => {
  return (
    <Switch>
      <Route path="/signin" component={SignIn} />
      <Route path="/register" component={Register} />
      <Route path="/preferences" component={Preferences} />

      <Route
        path={`/${Config.HOME_PAGE}/:category/search/:keyword`}
        component={Catalog}
      />
      <Route path={`/${Config.HOME_PAGE}/:category/:id`} component={Detail} />
      <Route path={`/${Config.HOME_PAGE}/:category`} component={Catalog} />
      <Route path={`/${Config.HOME_PAGE}`} exact component={Home} />
    </Switch>
  );
};

export default Routes;
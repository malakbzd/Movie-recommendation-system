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

      {/* 1. Base Genre Page (Shows genre dropdown) */}
      <Route
        path={`/${Config.HOME_PAGE}/:category/genre`}
        exact
        render={(props) => <Catalog {...props} isGenre={true} />}
      />

      {/* 2. Specific Genre Route (Keeps genre dropdown active) */}
      <Route
        path={`/${Config.HOME_PAGE}/:category/genre/:genreName`}
        render={(props) => <Catalog {...props} isGenre={true} />}
      />

      {/* 3. Search Route */}
      <Route
        path={`/${Config.HOME_PAGE}/:category/search/:keyword`}
        component={Catalog}
      />

      {/* 4. Detail Route */}
      <Route path={`/${Config.HOME_PAGE}/:category/:id`} component={Detail} />

      {/* 5. General Catalog Route (Only for regular movies/TV) */}
      <Route path={`/${Config.HOME_PAGE}/:category`} component={Catalog} />

      {/* 6. Home Route */}
      <Route path={`/${Config.HOME_PAGE}`} exact component={Home} />
    </Switch>
  );
};

export default Routes;
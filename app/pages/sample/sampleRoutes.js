import React from "react";
import {Route} from "react-router";
import appUtils from "../../utils/appUtils";

export default (loadRoute, forceToReload) => (
  <Route name="Subscribe" path={appUtils.getRoutePath('/sample')}
         getComponent={(l, cb) => import('./index.jsx').then(loadRoute(cb)).catch(forceToReload)}/>
);

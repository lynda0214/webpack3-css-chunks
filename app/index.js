import 'core-js/es6/map';
import 'core-js/es6/set';
import 'raf/polyfill';

import React from "react";
import ReactDOM from "react-dom";
import {browserHistory, Route, Router} from "react-router";
import appUtils from "./utils/appUtils";
import "intl";
import App from "./App.js";
import SampleRoutes from "./pages/sample/sampleRoutes";
import NotFound from "./errorpage/NotFound";
import "./assets/styles";

const loadRoute = cb => m => cb(null, m);
const forceToReload = (err) => {
  console.error(err);
  window.location.reload();
};

ReactDOM.render(
  <Router history={browserHistory}>
    <Route name="App" path={appUtils.getRoutePath()} component={App}>
      {SampleRoutes(loadRoute, forceToReload)}
      <Route name="Not found" path={appUtils.getRoutePath('/*')} component={NotFound}/>
    </Route>
  </Router>, document.getElementById('root')
);

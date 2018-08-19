import React from 'react'
import createHistory from 'history/createBrowserHistory';
import { Switch, Router, Route } from "react-router-dom";
import App from '../components/App';

export const history = createHistory()

const AppRouter = () => (
  <Router history={history}>
    <div>
      <Switch>
        <Route path="/" exact={true} component={App} />
      </Switch>
    </div>
  </Router>
)

export default AppRouter;

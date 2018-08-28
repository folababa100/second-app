import React from 'react'
import createHistory from 'history/createBrowserHistory';
import { Switch, Router, Route } from "react-router-dom";
import ProductsBox from '../components/ProductsBox';
import LoginPage from '../components/LoginPage';
import SignupPage from '../components/SignupPage'

export const history = createHistory()

const AppRouter = () => (
  <Router history={history}>
    <div>
      <Switch>
        <Route path="/" exact={true} component={ProductsBox} />
        <Route path="/login" component={LoginPage}/>
        <Route path="/signup" component={SignupPage}/>
      </Switch>
    </div>
  </Router>
)

export default AppRouter;

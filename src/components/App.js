import React from "react";
import { Grid } from "semantic-ui-react";
import "./App.css";
import { connect } from "react-redux";
import logo from '../logo.svg';
import './App.css';
import AppHeader from "./common/app-header";
import WorkFlows from "./work-flows/work-flows";
import WorkFlow from "./work-flows/work-flow";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter, Redirect
} from "react-router-dom";

function App({currentUser}) {
  // console.log(currentUser);
  return (
    <div className="App">
      <AppHeader currentUser={currentUser} primaryColor="purple"/>
    <Router>
      <Switch>
        <Route exact path="/workflow/:id" component={WorkFlow} />
        <Route exact path="/" component={WorkFlows} />
      </Switch>
    </Router>
    </div>
  );
}
const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
});
export default connect(mapStateToProps)(App);
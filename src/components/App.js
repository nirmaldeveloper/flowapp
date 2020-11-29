import React from "react";
import { Grid } from "semantic-ui-react";
import "./App.css";
import { connect } from "react-redux";
import logo from '../logo.svg';
import './App.css';
import AppHeader from "./common/app-header";
import workFlowHeader from "./work-flows/work-flow-header"
import workFlows from "./work-flows/work-flows"


function App({currentUser}) {
  console.log(currentUser);
  
  return (
    <div className="App">
    <AppHeader currentUser={currentUser} primaryColor="purple"/>
      <workFlows/>
    </div>
  );
}
const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
});
export default connect(mapStateToProps)(App);
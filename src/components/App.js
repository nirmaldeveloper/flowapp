import React from "react";
import { Grid } from "semantic-ui-react";
import "./App.css";
import { connect } from "react-redux";
import logo from '../logo.svg';
import './App.css';
import AppHeader from "./common/app-header";


function App({currentUser}) {
  return (
    <div className="App">
    <AppHeader currentUser={currentUser} primaryColor="purple"/>
      
    </div>
  );
}
const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
});
export default connect(mapStateToProps)(App);
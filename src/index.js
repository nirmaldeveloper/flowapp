import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import AppHeader from "./components/common/app-header";
import Spinner from "./Spinner";
import registerServiceWorker from "./registerServiceWorker";
import reportWebVitals from './reportWebVitals';
import firebase from "./firebase";
import { SnackbarProvider } from "notistack";
import "semantic-ui-css/semantic.min.css";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter
} from "react-router-dom";

import { createStore } from "redux";
import { Provider, connect } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";

import { setUser, clearUser,setCurrentWorkFlow } from "./actions";
import rootReducer from "./reducers";

const store = createStore(rootReducer, composeWithDevTools());

class Root extends React.Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.setUser(user);
        this.props.history.push("/");
      } else {
        this.props.history.push("/login");
        this.props.clearUser();
      }
    });
  }

  render() {
    return this.props.isLoading ? (
      <Spinner />
    ) : (
      <Switch>
        <SnackbarProvider maxSnack={3}>
        <Route exact path="/" component={App} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        </SnackbarProvider>
      </Switch>
    );
  }
}

const mapStateFromProps = state => ({
  isLoading: state.user.isLoading,
  currentUser:state.user,
  currentWorkFlow: state.workflow.currentWorkFlow
});

const RootWithAuth = withRouter(
  connect(
    mapStateFromProps,
    { setUser, clearUser,setCurrentWorkFlow }
  )(Root)
);

ReactDOM.render(
  
  <Provider store={store}>
    <Router>
      <RootWithAuth />
    </Router>
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


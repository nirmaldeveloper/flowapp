import React from "react";
import firebase from "../../firebase";
import { connect } from "react-redux";

import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Checkbox,
  Message
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import AppHeader from "../common/app-header";

class Login extends React.Component {
  state = {
    email: "",
    password: "",
    isChecked:false,
    errors: [],
    loading: false
  };

  componentDidMount() {
    if(localStorage.checkbox && localStorage.email !== ""){
      this.setState({
        isChecked:true,
        email:localStorage.email,
        password:localStorage.password
      })
    }
  }

  displayErrors = errors =>
    errors.map((error, i) => <p key={i}>{error.message}</p>);

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleCheckBoxChange = event => {
    this.setState({ isChecked: !this.state.isChecked });
  };

  handleSubmit = event => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      this.setState({ errors: [], loading: true });
      if(this.state.isChecked && this.state.email !== ""){
        localStorage.email = this.state.email;
        localStorage.password = this.state.password;
        localStorage.checkbox = this.state.isChecked;
      }
      firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(signedInUser => {
        })
        .catch(err => {
          console.error(err);
          this.setState({
            errors: this.state.errors.concat(err),
            loading: false
          });
        });
    }
  };

  isFormValid = ({ email, password }) => email && password;

  handleInputError = (errors, inputName) => {
    return errors.some(error => error.message.toLowerCase().includes(inputName))
      ? "error"
      : "";
  };

  render() {
    const { email, password, errors, loading, isChecked} = this.state;

    return (
        <div >
    <AppHeader primaryColor="purple"/>
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          
          <Form onSubmit={this.handleSubmit} size="large">
            <Segment stacked>
              <Header as="h1" icon color="blue" textAlign="center">
              Login
              </Header>
              <Form.Input
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email"
                onChange={this.handleChange}
                value={email}
                className={this.handleInputError(errors, "email")}
                type="email"
              />

              <Form.Input
                fluid
                name="password"
                icon="asterisk"
                iconPosition="left"
                placeholder="Password"
                onChange={this.handleChange}
                value={password}
                className={this.handleInputError(errors, "password")}
                type="password"
              />

              <Checkbox
                name="remeberMe"
                label="Remember me"
                float="left"
                className={"mb25"}
                onChange={this.handleCheckBoxChange}
                checked={isChecked}
              />

              <Button
                disabled={loading}
                className={loading ? "row loading mb25" : "row mb25"}
                color="blue"
                fluid
                size="large"
              >
                Login
              </Button>
            <Link to="/register">Don't have an account? Signup here.</Link>
            </Segment>
            
          </Form>
          {errors.length > 0 && (
            <Message error>
              <h3>Error</h3>
              {this.displayErrors(errors)}
            </Message>
          )}
          
        </Grid.Column>
      </Grid>
      </div>
    );
  }
}
const mapStateToProps = state => ({
    currentUser: state.user.currentUser,
  });
export default connect(mapStateToProps)(Login);

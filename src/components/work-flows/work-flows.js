import React from "react";
import {
  Form,
  Segment,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { Grid, Header, Icon, Dropdown, Image, Modal, Input, Button } from "semantic-ui-react";
import firebase from "../../firebase";
import { connect } from "react-redux";
import WorkFlow from "./work-flow";
import WorkFlowsHeader from "./work-flows-header";


class WorkFlows extends React.Component {
  state = {
    name: "",
    status: 1,
    id:null
  };
  render() {
    const pathname = window.location.pathname;
    return (
    <div>
        <p>some text</p>
        <WorkFlowsHeader/>
        <WorkFlow/>
    </div>
        );
    }
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
});
export default connect(mapStateToProps)(WorkFlows);
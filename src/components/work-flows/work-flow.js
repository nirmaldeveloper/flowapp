import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { Form,
  Segment,Grid, Header, Icon, Dropdown, Image, Modal, Input, Button } from "semantic-ui-react";
import firebase from "../../firebase";
import { connect } from "react-redux";

import node from "./work-flow-node";
import workFlowHeader from "./work-flow-header";

class workFlow extends React.Component {
  state = {
    name: "",
    status: 1,
    id:null
  };
  render() {
    const { primaryColor } = this.props;
    const pathname = window.location.pathname;
    return (
    <div>
        <workFlowHeader/>
    </div>
        );
    }
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
});
export default connect(mapStateToProps)(workFlow);
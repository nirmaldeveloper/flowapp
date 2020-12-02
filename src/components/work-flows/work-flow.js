import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { Form, Segment, Grid, Header, Icon, Dropdown, Image, Modal, Input, Button } from "semantic-ui-react";
import firebase from "../../firebase";
import { connect } from "react-redux";

import WorkFlowHeader from "./work-flow-header";
import WorkFlowNode from "./work-flow-node";

class WorkFlow extends React.Component {
  state = {
    name: "",
    status: 1,
    id:null,
    workFlowNodesRef: firebase.database().ref("workFlowNodes"),
    workFlowNodes: [],
    workFlowNodesLoading: true,
  };
  componentDidMount(){
    // const{id} = this.state;
    const id = window.location.pathname.split("/")[1];
    this.setState({ id: id });
    this.addListeners(id);
  }

  addListeners = workFlowId=>{
    let loadedNodes = [];
    const ref = this.state.workFlowNodesRef;
    ref.child(workFlowId).on("child_added", snap => {
      loadedNodes.push(snap.val());
      this.setState({
        workFlowNodes: loadedNodes,
        workFlowNodesLoading: false
      });
    });
  }
  displayWorkFlowNodes = nodes =>
  nodes.length > 0 &&
  nodes.map(node => (
    <WorkFlowNode key={node.id} workFlowNode={node}/>
  ));
  render() {
    const { primaryColor } = this.props;
    const{workFlowNodes} =this.state;
    // const id = window.location.pathname.split("/")[1];
    // this.setState({ id: id });

    return (
    <div>
        <WorkFlowHeader/>
        <Grid columns={4} style={{margin:"1.5rem"}}>
           {this.displayWorkFlowNodes(workFlowNodes)}
         </Grid>
        
    </div>
        );
    }
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
});
export default connect(mapStateToProps)(WorkFlow);
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
    errors:[],
    currentNode:""
  };
  componentDidMount(){
    // const{id} = this.state;
    const id = window.location.pathname.split("/")[2];
    this.setState({ id: id });
    this.addListeners(id);
  }

  addListeners = workFlowId =>{
    let loadedNodes = [];
    const ref = this.state.workFlowNodesRef;
    console.log(workFlowId);
    ref.child(workFlowId).on("child_added", snap => {
      loadedNodes.push(snap.val());
      console.log(snap.val());
      this.setState({
        workFlowNodes: loadedNodes,
        workFlowNodesLoading: false
      });
    });
  }
  createNode = (fileUrl = null) => {
    const node = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      title: "Enter Title",
      status:1,
      notes:"Enter Notes",
      order:this.state.workFlowNodes.length + 1
    }
    return node;
  };
  addNode = () => {
    const ref = this.state.workFlowNodesRef;
    const workFlowID = this.state.id;
    this.setState({currentNode: this.createNode()});
    const currentNode = this.state.currentNode;
    if (currentNode) {
      this.setState({ loading: true });
      ref.child(workFlowID)
        .push()
        .set(currentNode)
        .then(() => {
          this.setState({ loading: false, node: "", errors: [] });
          
        })
        .catch(err => {
          console.error(err);
          this.setState({
            loading: false,
            errors: this.state.errors.concat(err)
          });
        });
    } else {
      this.setState({
        errors: this.state.errors.concat({ message: "Add a node details" })
      });
    }
  };
  saveNodeStatus = nodeId=>{
     console.log(nodeId);
  }
  displayWorkFlowNodes = nodes =>
  nodes.length > 0 &&
  nodes.map(node => (
    <WorkFlowNode key={node.timestamp} saveNodeStatus={this.saveNodeStatus} workFlowNode={node}/>
  ));
  render() {
    const { primaryColor } = this.props;
    const{workFlowNodes} =this.state;
    // const id = window.location.pathname.split("/")[1];
    // this.setState({ id: id });

    return (
    <div>
        <WorkFlowHeader addNode={this.addNode}/>
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
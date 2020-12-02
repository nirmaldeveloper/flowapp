import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { Form, Segment, Grid, Header, Icon, Dropdown, Image, Modal, Input, Button } from "semantic-ui-react";
import firebase from "../../firebase";
import { connect } from "react-redux";
import LeaderLine from "react-leader-line";
import WorkFlowHeader from "./work-flow-header";
import WorkFlowNode from "./work-flow-node";
import { withSnackbar } from 'notistack';

class WorkFlow extends React.Component {
  state = {
    name: this.props.currentWorkFlow.name,
    status: 1,
    id:this.props.currentWorkFlow.id,
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
      loadedNodes[loadedNodes.length -1].key = snap.key;
      console.log(snap.key);
      this.setState({
        workFlowNodes: loadedNodes,
        workFlowNodesLoading: false
      });
//     if(loadedNodes.length > 0)
// {
//   loadedNodes.forEach(function(node, index){
//    if(index < loadedNodes.length -1){
//      let start = document.getElementById(loadedNodes[index].id);
//      let end = document.getElementById(loadedNodes[index+1].id);
//      if(start && end){
//        new LeaderLine(start,end);
//       }
//     }
//  }); 
// }
    });
  }
  createNode = (fileUrl = null) => {
    const key = this.state.workFlowNodesRef.push().key;

    const node = {
      id:key,
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
  deleteNode = ()=>{
    if(this.state.workFlowNodes.length > 0){
    const nodesRef = this.state.workFlowNodesRef;
    let lastNode = this.state.workFlowNodes.pop();
    console.log(this.state.id);
    console.log(lastNode.key);
    //child(this.state.id).
    nodesRef.child(this.state.id).child(lastNode.key).remove().then(()=>{
      const wf = this.state.workFlowNodes.filter(x=> x.id != lastNode.id);
      this.setState({workFlowNodes : wf});
      //this.setState({workFlowNodes : wf});
      this.props.enqueueSnackbar('Successfully deleted node from workflow.');
    }).catch(err => {
      this.props.enqueueSnackbar(err);
      console.error(err);
    });
  }
}
  displayWorkFlowNodes = nodes =>
  nodes.length > 0 &&
  nodes.map(node => (
    <WorkFlowNode key={node.key} saveNodeStatus={this.saveNodeStatus} workFlowNode={node}/>
  ));
  render() {
    const { primaryColor } = this.props;
    const{workFlowNodes,name} =this.state;
    // const id = window.location.pathname.split("/")[1];
    // this.setState({ id: id });

    return (
    <div>
        <WorkFlowHeader deleteNode={this.deleteNode} title={name} addNode={this.addNode}/>
        <Grid className="nodes" columns={4} style={{margin:"1.5rem"}}>
           {this.displayWorkFlowNodes(workFlowNodes)}
         </Grid>
    </div>
        );
    }
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  currentWorkFlow: state.workflow.currentWorkFlow
});
export default connect(mapStateToProps)(withSnackbar(WorkFlow));
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
    workFlowsRef: firebase.database().ref("workFlows"),
    workFlowNodes: [],
    workFlowNodesLoading: true,
    errors:[],
    newNode:"",
    currentNodeId:"",
    currentAction:"",
    isLoading:false
  };
  componentDidMount(){
    // const{id} = this.state;
    const id = window.location.pathname.split("/")[2];
    this.setState({ id: id });
    this.addListeners(id);
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  addListeners = workFlowId =>{
    let loadedNodes = [];
    const ref = this.state.workFlowNodesRef;
    // console.log(workFlowId);
    let addedKeys = [];
    ref.child(workFlowId).on("child_added", snap => {
      if(addedKeys.indexOf(snap.key) === -1){
        addedKeys.push(snap.key);
        loadedNodes.push(snap.val());
        loadedNodes[loadedNodes.length -1].key = snap.key;
        this.setState({
          workFlowNodes: loadedNodes,
          workFlowNodesLoading: false
        });
    }
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

  removeListeners = () => {
    this.state.workFlowNodesRef.off();
    this.state.workFlowsRef.off();
  };

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
    this.setState({isLoading:true,currentAction:"Adding Node"});
    const newNode = this.createNode();
    if (newNode) {
      this.setState({ loading: true });
      this.setState({isLoading:true,currentAction:"Adding Node"});

      ref.child(workFlowID)
        .push()
        .set(newNode)
        .then(() => {
          this.setState({isLoading:false,currentAction:""});
          this.setState({ loading: false, node: "", errors: [] });
          
        })
        .catch(err => {
      this.setState({isLoading:false,currentAction:""});

          console.error(err);
          this.setState({
            loading: false,
            errors: this.state.errors.concat(err)
          });
        });
    } else {
      this.setState({isLoading:false,currentAction:""});

      this.setState({
        errors: this.state.errors.concat({ message: "Add a node details" })
      });
    }
  };
  saveNodeStatus = node=>{
     console.log(node.status);
     this.setState({isLoading:true,currentAction:"Saving Node", currentNodeId:node.id});
     const nodesRef = this.state.workFlowNodesRef;
     node.status = node.status === 2 ? 0 : node.status +1;
     nodesRef.child(this.state.id).child(node.key).update({status:node.status}).then(()=>{
      this.props.enqueueSnackbar('Successfully update node status.');
     this.setState({isLoading:false,currentAction:"", currentNodeId:""});


     }).catch(err=>{
     this.setState({isLoading:false,currentAction:"", currentNodeId:""});
      this.props.enqueueSnackbar('Failed to update node status.');
     });
  }
  deleteNode = ()=>{
    if(this.state.workFlowNodes.length > 0){
      this.setState({isLoading:true,currentAction:"Deleting Node"});

    const nodesRef = this.state.workFlowNodesRef;
    let lastNode = this.state.workFlowNodes.pop();
    nodesRef.child(this.state.id).child(lastNode.key).remove().then(()=>{
      const wf = this.state.workFlowNodes.filter(x=> x.id != lastNode.id);
      this.setState({workFlowNodes : wf});
      this.setState({isLoading:false,currentAction:""});

      //this.setState({workFlowNodes : wf});
      this.props.enqueueSnackbar('Successfully deleted node from workflow.');
    }).catch(err => {
      this.setState({isLoading:false,currentAction:""});
      this.props.enqueueSnackbar(err);
      console.error(err);
    });
  }
}
// useEffect = () => {
//   this.shuffleNodes()
// }
saveWorkFlow = () =>{
  if(this.state.workFlowNodes.length > 0){
  this.setState({isLoading:true,currentAction:"Saving Nodes"});
  const nodesRef = this.state.workFlowNodesRef;
  const workFlowsRef = this.state.workFlowsRef;
  let count = 0;
  this.state.workFlowNodes.forEach(element => {
    nodesRef.child(this.state.id).child(element.key).update({
      id:element.id,
      timestamp: element.timestamp,
      title: element.title,
      status:element.status,
      notes:element.notes,
      order:element.order
    }).then(()=>{
      count++;
      if(count === this.state.workFlowNodes.length){
        workFlowsRef.child(this.state.id).update({name:this.state.name}).then(()=>{
          this.props.enqueueSnackbar('Successfully saved WorkFlow.');
          this.setState({isLoading:false,currentAction:"", currentNodeId:""});
        }).catch(err=>{
          this.setState({isLoading:false,currentAction:"", currentNodeId:""});
          this.props.enqueueSnackbar('Failed to save WorkFlow.');
      
        });
      }
     }).catch(err=>{
     this.setState({isLoading:false,currentAction:"", currentNodeId:""});
      this.props.enqueueSnackbar('Failed to save WorkFlow.');
     });
  });
  }
}
handleNodeChange = nodeState =>{
  const index = this.state.workFlowNodes.findIndex(item => item.id === nodeState.id);
  this.state.workFlowNodes[index] = nodeState;
}
handleHeaderChange = node=>{
  this.setState({name: node.title});
}
shuffleNodes = () =>{
  this.setState({isLoading:true,currentAction:"Shuffling Nodes"});
  let loadedNodes = this.state.workFlowNodes;
  for (let i = loadedNodes.length-1; i > 0; i--){
    const j = Math.floor(Math.random()*(i+1));
    const temp = loadedNodes[i];
    loadedNodes[i] = loadedNodes[j];
    loadedNodes[i] = temp;
  }
  for(let i=0;i<loadedNodes.length;i++){
    loadedNodes[i].order = i+1;
  }
  this.setState({isLoading:false,currentAction:"",workFlowNodes:loadedNodes});
}
  displayWorkFlowNodes = nodes =>
  nodes.length > 0 &&
  nodes.map(node => (
    <WorkFlowNode key={node.key} isLoading={this.state.isLoading} currentAction={this.state.currentAction} currentNodeId={this.state.currentNodeId} handleNodeChange={this.handleNodeChange} saveNodeStatus={this.saveNodeStatus} workFlowNode={node}/>
  ));
  render() {
    const { primaryColor } = this.props;
    const{workFlowNodes,name,currentAction,isLoading,currentNodeId} =this.state;
    return (
    <div>
        <WorkFlowHeader handleChange={this.handleHeaderChange} saveWorkFlow={this.saveWorkFlow} isLoading={isLoading} currentAction={currentAction} shuffleNodes={this.shuffleNodes} deleteNode={this.deleteNode} title={name} addNode={this.addNode}/>
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
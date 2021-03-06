import React from "react";
import {
  Form,
  Segment,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { Label,Grid, Header, Icon, Dropdown, Image, Modal, Input, Button } from "semantic-ui-react";
import firebase from "../../firebase";
import { connect } from "react-redux";
import WorkFlow from "./work-flow";
import WorkFlowsHeader from "./work-flows-header";
import {setCurrentWorkFlow} from "../../actions/index";
import { withSnackbar } from 'notistack';


class WorkFlows extends React.Component {
  state = {
    workFlowName:"",
    userID:this.props.currentUser.uid,
    workFlows:[],
    workFlowsRef: firebase.database().ref("workFlows"),
    workFlowNodesRef: firebase.database().ref("workFlowNodes"),
    modal: false,
    searchTerm: "",
    searchLoading: false,
    searchResults: [],
    filter:-1,
    currentWorkFlowId:"",
    currentWorkFlowAction:"",
    isLoading:false,
    unsubscribe:""
  };
  componentDidMount() {
    console.log(this.state.userID);
    this.addListeners();
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  addListeners = () => {
    let loadedWorkFlows = [];//.orderByChild("createdBy").equalTo(this.state.userID)
    this.state.workFlowsRef.orderByChild("createdBy").equalTo(this.state.userID).on("child_added", (snap) => {
      loadedWorkFlows.push(snap.val());
      this.setState({ workFlows: loadedWorkFlows });
    });
  };

  removeListeners = () => {
    this.state.workFlowNodesRef.off();
    this.state.workFlowsRef.off();
    // this.state.unsubscribe();
  };

  updateWorkFlowStatus=(workFlow)=>{
    var self = this;
    this.setState({isLoading:true,currentWorkFlowAction:"Updating Node", currentWorkFlowId:workFlow.id});
    if(workFlow.status == 2){
      let ref = this.state.workFlowsRef;
      ref.child(workFlow.id).update({status:1}).then(()=>{
        workFlow.status = 1;
        this.props.enqueueSnackbar('Successfully updated the WorkFlow Status!!');
        this.setState({isLoading:false,currentWorkFlowAction:"", currentWorkFlowId:""});

      }).catch(err=>{
        this.setState({isLoading:false,currentWorkFlowAction:"", currentWorkFlowId:""});
        this.props.enqueueSnackbar('Error updating the WorkFlow Status.');
      });
    }else{
        let ref = this.state.workFlowNodesRef;
        let loadedNodes = [];
        let addedKeys = [];
        // this.state.unsubscribe = 
        ref.child(workFlow.id).on("value", function(data){
        console.log(data.val());
        let nodeInCompletetatusLen =0;
        data.forEach(function(record){
          if(record.val().status !== 3){
              nodeInCompletetatusLen++;
          }
        });
        if(nodeInCompletetatusLen > 0){
          self.setState({isLoading:false,currentWorkFlowAction:"", currentWorkFlowId:""});
          self.props.enqueueSnackbar('Please complete the tasks to change the WorkFlow Status.');
        }else{
          const ref = self.state.workFlowsRef;
          ref.child(workFlow.id).update({status:2}).then(()=>{
            workFlow.status = 2;
            self.setState({isLoading:false,currentWorkFlowAction:"", currentWorkFlowId:""});
            self.props.enqueueSnackbar('Successfully updated the WorkFlow Status!!');
          }).catch(err=>{
            self.setState({isLoading:false,currentWorkFlowAction:"", currentWorkFlowId:""});
            self.props.enqueueSnackbar('Error updating the WorkFlow Status.');
          });
        }
      });
      }
    }

  deleteWorkFlow=id=>{
    console.log(id);
    const workFlowRef = this.state.workFlowsRef;
    const nodesRef = this.state.workFlowNodesRef;
    this.setState({isLoading:true,currentWorkFlowAction:"Deleting Node", currentWorkFlowId:id});

    nodesRef.child(id).remove().then(()=>{
      const wf = this.state.workFlows.filter(x=> x.id != id);
      this.setState({workFlows : wf});
      this.props.enqueueSnackbar('Successfully deleted the workflow.');
      workFlowRef.child(id).remove().then(()=>{
        this.setState({isLoading:false,currentWorkFlowAction:"", currentWorkFlowId:""});
      });
    }).catch(err => {
      this.setState({isLoading:false,currentWorkFlowAction:"", currentWorkFlowId:""});
      this.props.enqueueSnackbar(err);
      console.error(err);
    });
  }

  changeWorkFlow = workFlow=>{
    this.props.setCurrentWorkFlow(workFlow);
  }

  displayWorkFlows = flows =>
  flows.length > 0 &&
  flows.map(flow => (
        <Grid.Column width={4} key={flow.id} >
            <Segment style={{height:"140px"}} stacked>
            <Grid.Row>
            <Button floated="right" color="red" disabled={this.state.isLoading && this.state.currentWorkFlowId === flow.id && this.state.currentWorkFlowAction==="Deleting Node"}
            className={(this.state.isLoading && this.state.currentWorkFlowId === flow.id && this.state.currentWorkFlowAction==="Deleting Node") ? "loading" : ""} onClick={()=>this.deleteWorkFlow(flow.id)} style={{marginRight:"-30px",marginTop:"-35px"}} circular icon='trash alternate outline' />
            <Link onClick={()=>this.changeWorkFlow(flow)} to={`/workflow/${flow.id}`}><Segment><span style={{cursor:"pointer", display:"flex"}}>{flow.name}</span> </Segment></Link>
            </Grid.Row>
            <Grid.Row style={{marginTop:"20px",height:"25px"}}>
            <span floated="left" style={{float:"left",marginLeft:"4px"}}>{flow.status==1 ? 'PENDING': 'COMPLETED'}</span> 
            <Button disabled={this.state.isLoading && this.state.currentWorkFlowId === flow.id && this.state.currentWorkFlowAction==="Updating Node"}
            className={(this.state.isLoading && this.state.currentWorkFlowAction==="Updating Node") ? "loading" : ""} onClick={()=>this.updateWorkFlowStatus(flow)}  floated="right" color={flow.status==2?"green":"grey"} circular icon='check' />
            </Grid.Row>
            </Segment>
         </Grid.Column>
  ));

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  openModal = () => this.setState({ modal: true });

  closeModal = () => this.setState({ modal: false });
  
  addWorkFlow = () => {
    const { workFlowsRef,workFlowName,userID } = this.state;

    const key = workFlowsRef.push().key;

    const newWorkFlow = {
      id: key,
      name: workFlowName,
      status: 1,
      createdBy: userID
    };

    workFlowsRef
      .child(key)
      .update(newWorkFlow)
      .then(() => {
        this.setState({ workFlowName: ""});
        this.closeModal();
        console.log("workFlow added");
      })
      .catch(err => {
        console.error(err);
      });
  };

  isFormValid = ({ workFlowName }) => workFlowName;
  
  handleSubmit = event =>{
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      this.addWorkFlow();
    }
  }

  handleSearchChange = event => {
    // if(event && event.target){
      console.log(event.target.value);
    this.setState(
      {
        searchTerm: event.target.value,
        searchLoading: true
      },
      () =>
       this.handleSearchWorkFlows()
    );
  // }
  };

  handleSearchWorkFlows = () => {
    const workFlows = [...this.state.workFlows];
    const searchResults = [...this.state.searchResults];
    const filter = this.state.filter;
    const regex = new RegExp(this.state.searchTerm, "gi");
    
    const searchResultsArr = workFlows.reduce((acc, workFlow) => {
      if (workFlow.name && workFlow.name.match(regex) && filter > -1 &&  workFlow.status== filter) 
       {
        acc.push(workFlow);
      }else if(filter == -1 && workFlow.name && workFlow.name.match(regex)){
        acc.push(workFlow);
      }
      return acc;
    }, []);
    this.setState({ searchResults:searchResultsArr });

    setTimeout(() => this.setState({ searchLoading: false }), 1000);
  };

  handleFilterChange = (option) => {
    const workFlows = [...this.state.workFlows];
    const searchResults = [...this.state.searchResults];
    const filter = this.state.filter;
    const regex = new RegExp(this.state.searchTerm, "gi");
    
    const searchResultsArr = workFlows.reduce((acc, workFlow) => {
      if (workFlow.name && workFlow.name.match(regex) && option > -1 &&  workFlow.status== option) 
       {
        acc.push(workFlow);
      }else if(option == -1 && workFlow.name && workFlow.name.match(regex)){
        acc.push(workFlow);
      }
      return acc;
    }, []);
  this.setState({ searchResults:searchResultsArr, filter:option });
  setTimeout(() => this.setState({ searchLoading: false }), 1000);
  }

  render() {
    const pathname = window.location.pathname;
    const{workFlows, modal, searchTerm,searchLoading,searchResults, filter} = this.state;
    return (
    <div>
        <WorkFlowsHeader handleFilterChange={this.handleFilterChange} handleSearchChange={this.handleSearchChange} searchTerm={searchTerm} searchLoading={searchLoading} searchResults={searchResults} openWorkFlowModal={this.openModal}/>
        <Grid columns={4} style={{margin:"1.5rem"}}>
           {(searchTerm || filter > -1 )?this.displayWorkFlows(searchResults):this.displayWorkFlows(workFlows)}
         </Grid>
         <Modal basic open={modal} onClose={this.closeModal}>
          <Modal.Header>Add a WorkFlow</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.handleSubmit}>
              <Form.Field>
                <Input
                  fluid
                  label="Name of Work Flow"
                  name="workFlowName"
                  onChange={this.handleChange}
                />
              </Form.Field>
            </Form>
          </Modal.Content>

          <Modal.Actions>
            <Button color="green" inverted onClick={this.handleSubmit}>
              <Icon name="checkmark" /> Add
            </Button>
            <Button color="red" inverted onClick={this.closeModal}>
              <Icon name="remove" /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
     </div>
        );
    }
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
});


export default connect(mapStateToProps,{setCurrentWorkFlow})(withSnackbar(WorkFlows));
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


class WorkFlows extends React.Component {
  state = {
    workFlowName:"",
    userID:this.props.currentUser.uid,
    workFlows:[],
    workFlowsRef: firebase.database().ref("workFlows"),
    modal: false,
    searchTerm: "",
    searchLoading: false,
    searchResults: [],
    filter:-1
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
    this.state.workFlowsRef.off();
  };

  updateWorkFlowStatus=id=>{
console.log(id);
  }

  deleteWorkFlow=id=>{
console.log(id);
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
            <Button floated="right" color="red" onClick={()=>this.deleteWorkFlow(flow.id)} style={{marginRight:"-30px",marginTop:"-35px"}} circular icon='trash alternate outline' />
            <Link onClick={()=>this.changeWorkFlow(flow)} to={`/workflow/${flow.id}`}><Segment><span style={{cursor:"pointer", display:"flex"}}>{flow.name}</span> </Segment></Link>
            </Grid.Row>
            <Grid.Row style={{marginTop:"20px",height:"25px"}}>
            <span floated="left" style={{float:"left",marginLeft:"4px"}}>{flow.status==1 ? 'PENDING': 'COMPLETED'}</span> 
            <Button onClick={()=>this.updateWorkFlowStatus(flow.id)}  floated="right" color={flow.status==2?"green":"grey"} circular icon='check' />
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


export default connect(mapStateToProps,{setCurrentWorkFlow})(WorkFlows);
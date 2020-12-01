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


class WorkFlows extends React.Component {
  state = {
    workFlowName:"",
    userID:this.props.currentUser.uid,
    workFlows:[],
    workFlowsRef: firebase.database().ref("workFlows"),
    modal: false
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
      debugger;
      loadedWorkFlows.push(snap.val());
      this.setState({ workFlows: loadedWorkFlows });
    });
  };

  removeListeners = () => {
    this.state.workFlowsRef.off();
  };

  displayWorkFlows = flows =>
  flows.length > 0 &&
  flows.map(flow => (
        <Grid.Column width={4} key={flow.id} >
            <Segment style={{height:"140px"}} stacked>
            <Grid.Row>
            <Button floated="right" color="red" style={{marginRight:"-30px",marginTop:"-35px"}} circular icon='trash alternate outline' />
            <Segment><span style={{cursor:"pointer", display:"flex"}}>{flow.name}</span> </Segment>
            </Grid.Row>
            <Grid.Row style={{marginTop:"20px",height:"25px"}}>
            <span floated="left" style={{float:"left",marginLeft:"4px"}}>{flow.status==1 ? 'PENDING': 'COMPLETED'}</span> 
            <Button floated="right" color={flow.status==2?"green":"grey"} circular icon='check' />
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

  render() {
    const pathname = window.location.pathname;
    const{workFlows, modal} = this.state;
    return (
    <div>
        <WorkFlowsHeader openWorkFlowModal={this.openModal}/>
        <Grid columns={4} style={{margin:"1.5rem"}}>
           {this.displayWorkFlows(workFlows)}
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
export default connect(mapStateToProps)(WorkFlows);
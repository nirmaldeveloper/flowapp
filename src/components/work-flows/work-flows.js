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
        <Grid.Column key={flow.id} style={{ width: "350px", maxHeight:"500px" , marginTop:"50px",marginLeft:"15px", marginRight:"20px"}}>
          <Form onSubmit={this.handleSubmit} size="large">
            <Segment style={{height:"140px"}} stacked>
            <Grid.Row>
            <Button floated="right" color="red" style={{marginRight:"-30px",marginTop:"-35px"}} circular icon='trash alternate outline' />
            <span style={{width: "100%",float: "left",paddingTop: "10px",border: "2px grey solid",marginBottom: "25px"}}>{flow.name}</span> 
            </Grid.Row>
            <Grid.Row style={{marginTop:"20px",height:"25px"}}>
            <span floated="left" style={{float:"left",marginLeft:"4px"}}>{flow.status==1 ? 'PENDING': 'COMPLETED'}</span> 
            <Button floated="right" color={flow.status==2?"green":"grey"} circular icon='check' />
            </Grid.Row>
            </Segment>
            </Form>
         </Grid.Column>
  ));

  openModal = () => this.setState({ modal: true });

  closeModal = () => this.setState({ modal: false });
  handleSubmit = event =>{
    event.preventDefault();
  // if (this.isFormValid(this.state)) {
  //   this.addChannel();
  // }
  }
  render() {
    const pathname = window.location.pathname;
    const{workFlows, modal} = this.state;
    return (
    <div>
        <WorkFlowsHeader openWorkFlowModal={this.openModal}/>
        <div style={{display:"flex"}}>
           {this.displayWorkFlows(workFlows)}
         </div>
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
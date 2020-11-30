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
            <Button floated="right" color="red" style={{marginRight:"-30px",marginTop:"-35px"}} circular icon='trash alternate outline' /><Form.Input style={{paddingTop:"10px"}} value={flow.name}></Form.Input> 
            </Grid.Row>
            <Grid.Row style={{marginTop:"20px",height:"25px"}}>
            <span floated="left" style={{float:"left",marginLeft:"4px"}}>{flow.status==1 ? 'PENDING': 'COMPLETED'}</span> 
            <Button floated="right" color={flow.status==2?"green":"grey"} circular icon='check' />
            </Grid.Row>
            </Segment>
            </Form>
            </Grid.Column>
            
    
  ));

  render() {
    const pathname = window.location.pathname;
    const{workFlows} = this.state;
    return (
    <div>
        <WorkFlowsHeader/>
        <div style={{display:"flex"}}>
         {this.displayWorkFlows(workFlows)}
         </div>
    </div>
        );
    }
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
});
export default connect(mapStateToProps)(WorkFlows);
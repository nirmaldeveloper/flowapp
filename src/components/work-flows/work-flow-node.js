import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSitemap } from '@fortawesome/free-solid-svg-icons';
import { Form, Segment, Grid, Header, Icon, Dropdown, Image, Modal, Input, Button, TextArea } from "semantic-ui-react";
import firebase from "../../firebase";
import { connect } from "react-redux";


class WorkFlowNode extends React.Component {
  state = {
    name: "",
    status: 1,
    note:"",
    id:null,
    title:this.props.workFlowNode.title,
    notes:this.props.workFlowNode.notes
  };
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  }
  render() {
    const { primaryColor,saveNodeStatus,currentNodeId, currentAction, isLoading } = this.props;
    const pathname = window.location.pathname;
    const {notes,title} = this.state;
    const node = this.props.workFlowNode;
    
    
    return (
      <Grid.Column id={node.id} key={node.id} style={{marginBottom:"20px"}} >
      <Segment style={{height:"350px"}} stacked>
      <Grid.Row>
      <Button
      disabled={isLoading && currentAction === "Saving Node", currentNodeId == node.id}
      className={(isLoading && currentAction === "Saving Node", currentNodeId == node.id) ? "loading" : ""}
      onClick={()=>saveNodeStatus(node)} floated="right" color={node.status==1?"grey":node.status==2?"blue":"green"} style={{marginRight:"-30px",marginTop:"-35px"}} circular icon='check' />
      <Input name="title" value={title} onChange={this.handleChange}></Input>
      </Grid.Row>
      <Grid.Row style={{marginTop:"20px",height:"25px"}}>
      <TextArea style={{
        height: "250px",
        width: "180px",
        float: "left",
        marginLeft: "30px"
      }}name="notes" value={notes} onChange={this.handleChange}></TextArea>
      </Grid.Row>
      </Segment>
   </Grid.Column>
        );
    }
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
});
export default connect(mapStateToProps)(WorkFlowNode);
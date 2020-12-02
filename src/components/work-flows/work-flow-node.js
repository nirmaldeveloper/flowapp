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
    id:null
  };
  render() {
    const { primaryColor,saveNodeStatus } = this.props;
    const node = this.props.workFlowNode;
    const pathname = window.location.pathname;
    
    return (
      <Grid.Column key={node.id} style={{marginBottom:"20px"}} >
      <Segment style={{height:"350px"}} stacked>
      <Grid.Row>
      <Button onClick={()=>saveNodeStatus(node.id)} floated="right" color={node.status==1?"grey":node.status==2?"blue":"green"} style={{marginRight:"-30px",marginTop:"-35px"}} circular icon='check' />
      <Input value={node.title}></Input>
      </Grid.Row>
      <Grid.Row style={{marginTop:"20px",height:"25px"}}>
      <TextArea style={{
        height: "250px",
        width: "180px",
        float: "left",
        marginLeft: "30px"
      }} value={node.notes}></TextArea>
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
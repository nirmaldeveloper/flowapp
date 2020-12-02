import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSitemap } from '@fortawesome/free-solid-svg-icons';
import { Form, Segment, Grid, Header, Icon, Dropdown, Image, Modal, Input, Button, TextArea } from "semantic-ui-react";
import firebase from "../../firebase";
import { connect } from "react-redux";


class WorkFlowNodeSkeleton extends React.Component {
  state = {
    status: this.props.workFlowNode.status,
    id:this.props.workFlowNode.id,
    title:this.props.workFlowNode.title,
    notes:this.props.workFlowNode.notes,
    order:this.props.workFlowNode.order,
    key:this.props.workFlowNode.key,
    timestamp:this.props.workFlowNode.timestamp
  };
  
  render() {
    const node = this.props.workFlowNode;
    return (
      <Grid.Column className="skeleton" id={node.id} key={node.id} style={{marginBottom:"20px"}} >
      <Segment style={{height:"350px"}} stacked>
      <Grid.Row className="skeleton">
      <Button floated="right" className="skeleton__status" style={{marginRight:"-30px",marginTop:"-35px"}} circular icon='check' />
      <Input name="title" className="skeleton__title"></Input>
      </Grid.Row>
      <Grid.Row className="skeleton" style={{marginTop:"20px",height:"25px"}}>
      <TextArea className="skeleton__notes" style={{
        height: "250px",
        width: "180px",
        float: "left",
        marginLeft: "30px"
      }}name="notes" ></TextArea>
      </Grid.Row>
      </Segment>
   </Grid.Column>
        );
    }
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
});
export default connect(mapStateToProps)(WorkFlowNodeSkeleton);
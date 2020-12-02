import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSitemap } from '@fortawesome/free-solid-svg-icons';
import { Form, Segment, Grid, Header, Icon, Dropdown, Image, Modal, Input, Button } from "semantic-ui-react";
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
    const { primaryColor } = this.props;
    const node = this.props.workFlowNode;
    const pathname = window.location.pathname;
    
    return (
      
      <Grid.Column width={4} key={node.id} >
      <Segment style={{height:"140px"}} stacked>
      <Grid.Row>
      <Button floated="right" color="red" style={{marginRight:"-30px",marginTop:"-35px"}} circular icon='trash alternate outline' />
      <Link to={`/workflow/${node.id}`}><Segment><span style={{cursor:"pointer", display:"flex"}}>{node.name}</span> </Segment></Link>
      </Grid.Row>
      <Grid.Row style={{marginTop:"20px",height:"25px"}}>
      <span floated="left" style={{float:"left",marginLeft:"4px"}}>{node.status==1 ? 'PENDING': 'COMPLETED'}</span> 
      <Button floated="right" color={node.status==2?"green":"grey"} circular icon='check' />
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
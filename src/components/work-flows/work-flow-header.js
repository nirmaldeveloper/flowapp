import React from "react";
import _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSitemap,faPlus,faFilter, faSearch,faRandom, faTimes } from '@fortawesome/free-solid-svg-icons'
import { Grid, Header, Icon, Dropdown, Image, Modal, Input, Button,Search ,Segment} from "semantic-ui-react";
import firebase from "../../firebase";

class WorkFlowHeader extends React.Component {
  state={
    user:this.props.currentUser,
    title:this.props.title,
  }
  
  render() {
    const { primaryColor } = "#ffffff";
    const pathname = window.location.pathname;
    const {title} = this.state;
    const {addNode,deleteNode,shuffleNodes,isLoading,currentAction} = this.props;

    return (
      <Grid style={{ background: primaryColor }}>
      <Grid.Column>
        <Segment stacked>
        <Grid.Row style={{height:"30px", margin: 0 }}>
        <Input style={{float:"left", paddingLeft:"50px", width:"400px"}} floated="left" value={title}></Input>

          <Button
            disabled={isLoading && currentAction === "Save"}
            className={(isLoading && currentAction === "Save") ? "loading" : ""}
            onClick={this.saveWorkFlow}
            floated="right"  
            color="blue"
              size="small">
              Save
            </Button>
            <Button            
            disabled={isLoading && currentAction === "Adding Node"}
            className={(isLoading && currentAction === "Adding Node") ? "loading" : ""}
            style={{marginRight:"10px"}}
            onClick={addNode}
            floated="right"  
            color="green"
              size="small">
          <FontAwesomeIcon icon={faPlus} /> &nbsp;
              Add Node
            </Button>
            <Button
            disabled={isLoading && currentAction === "Deleting Node"}
            className={(isLoading && currentAction === "Deleting Node") ? "loading" : ""}
            style={{marginRight:"10px"}}
            onClick={deleteNode}
            floated="right"  
            color="red"
              size="small">
          <FontAwesomeIcon icon={faTimes} /> &nbsp;
              Delete
            </Button>
            <Button
            disabled={isLoading && currentAction === "Shuffling Nodes"}
            className={(isLoading && currentAction === "Shuffling Nodes") ? "loading" : ""}
            style={{marginRight:"10px"}}
            onClick={shuffleNodes}
            floated="right"  
            color="purple"
              size="small">
          <FontAwesomeIcon icon={faRandom} /> &nbsp;
              Shuffle
            </Button>
          </Grid.Row>
          </Segment>
          </Grid.Column>
    </Grid>
    );
  }
}

export default WorkFlowHeader;

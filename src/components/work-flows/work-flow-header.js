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
    addNode: this.props.addNode
  }
  
  render() {
    const { primaryColor } = "#ffffff";
    const pathname = window.location.pathname;
    const {addNode,title} = this.state;
    return (
      <Grid style={{ background: primaryColor }}>
      <Grid.Column>
        <Segment stacked>
        <Grid.Row style={{height:"30px", margin: 0 }}>
        <Input floated="left" value={title}></Input>

          <Button
            onClick={this.saveWorkFlow}
            floated="right"  
            color="blue"
              size="small">
              Save
            </Button>
            <Button
            style={{marginRight:"10px"}}
            onClick={addNode}
            floated="right"  
            color="green"
              size="small">
          <FontAwesomeIcon icon={faPlus} /> &nbsp;
              Add Node
            </Button>
            <Button
            style={{marginRight:"10px"}}
            onClick={this.deleteWorkFlow}
            floated="right"  
            color="red"
              size="small">
          <FontAwesomeIcon icon={faTimes} /> &nbsp;
              Delete
            </Button>
            <Button
            style={{marginRight:"10px"}}
            onClick={this.shuffleNodes}
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

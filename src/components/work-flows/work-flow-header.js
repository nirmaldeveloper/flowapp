import React from "react";
import _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSitemap,faPlus,faFilter, faSearch } from '@fortawesome/free-solid-svg-icons'
import { Grid, Header, Icon, Dropdown, Image, Modal, Input, Button,Search } from "semantic-ui-react";
import firebase from "../../firebase";

class WorkFlowHeader extends React.Component {
  state={
    user:this.props.currentUser
  }
  
  render() {
    const { primaryColor } = "#ffffff";
    const pathname = window.location.pathname;
    return (
        <Grid style={{ background: primaryColor }}>
        <Grid.Column>
          <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
            { this.state.user !== null && this.state.user !== undefined &&
            (<Button
              onClick={this.logOut}
              floated="right"  
              color="teal"
                size="small">
                Logout
              </Button>
            )}
            </Grid.Row>
            </Grid.Column>
      </Grid>
    );
  }
}

export default WorkFlowHeader;

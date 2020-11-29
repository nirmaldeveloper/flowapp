import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSitemap } from '@fortawesome/free-solid-svg-icons'
//import UserPanel from "./UserPanel";
import { Grid, Header, Icon, Dropdown, Image, Modal, Input, Button } from "semantic-ui-react";
import firebase from "../../firebase";


class AppHeader extends React.Component {
  state={
    user:this.props.currentUser
  }
  logOut = event => {
    event.preventDefault();
      firebase
        .auth()
        .signOut().then(()=>{
        });
        
  };
  render() {
    const { primaryColor } = this.props;
    const pathname = window.location.pathname;
    return (
        <Grid style={{ background: primaryColor }}>
        <Grid.Column>
          <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
            {/* App Header */}
            <Header style={{marginBottom: "0px"}} inverted floated="left" as="h2">
            <FontAwesomeIcon icon={faSitemap} /> &nbsp;
              <Header.Content>FLOWAPP</Header.Content>
            </Header>
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

export default AppHeader;

import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSitemap } from '@fortawesome/free-solid-svg-icons'
//import UserPanel from "./UserPanel";
import { Grid, Header, Icon, Dropdown, Image, Modal, Input, Button } from "semantic-ui-react";
import firebase from "../../firebase";


class AppHeader extends React.Component {
  logOut = event => {
    event.preventDefault();
      firebase
        .auth()
        .signOut();
  };
  render() {
    const { primaryColor } = this.props;

    return (
        <Grid style={{ background: primaryColor }}>
        <Grid.Column>
          <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
            {/* App Header */}
            <Header inverted floated="left" as="h2">
            <FontAwesomeIcon icon={faSitemap} /> &nbsp;
              <Header.Content>FLOWAPP</Header.Content>
            </Header>
            <Button
              onClick={this.logOut}
              floated="right"  
              color="teal"
                size="small">
                Logout
              </Button>
            </Grid.Row>
            </Grid.Column>
      </Grid>
    );
  }
}

export default AppHeader;

import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSitemap } from '@fortawesome/free-solid-svg-icons'
//import UserPanel from "./UserPanel";
import { Grid, Header, Icon, Dropdown, Image, Modal, Input, Button } from "semantic-ui-react";


class AppHeader extends React.Component {
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
            </Grid.Row>
            </Grid.Column>
      </Grid>
    );
  }
}

export default AppHeader;

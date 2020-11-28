import React from "react";
//import UserPanel from "./UserPanel";
import { Grid, Header, Icon, Dropdown, Image, Modal, Input, Button } from "semantic-ui-react";


class AppHeader extends React.Component {
  render() {
    const { currentUser, primaryColor } = this.props;

    return (
        <Grid style={{ background: primaryColor }}>
        <Grid.Column>
          <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
            {/* App Header */}
            <Header inverted floated="left" as="h2">
              <Icon name="code" />
              <Header.Content>FlowApp</Header.Content>
            </Header>
            </Grid.Row>
            </Grid.Column>
      </Grid>
    );
  }
}

export default AppHeader;

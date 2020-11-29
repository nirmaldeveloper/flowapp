import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSitemap,faPlus,faFilter, faSearch } from '@fortawesome/free-solid-svg-icons'
import { Grid, Header, Icon, Dropdown, Image, Modal, Input, Button } from "semantic-ui-react";
import firebase from "../../firebase";


class workFlowHeader extends React.Component {
  state={
    user:this.props.currentUser
  }
  createWorkflow = event =>{
    event.preventDefault();

  }
  
  render() {
    const { primaryColor } = "#ffffff";
    const pathname = window.location.pathname;
    return (
        <Grid style={{ background: primaryColor }}>
        <Grid.Column>
          <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
          <Search
            input={{ icon: 'search', iconPosition: 'left' }}
            loading={isLoading}
            onResultSelect={this.handleResultSelect}
            onSearchChange={_.debounce(this.handleSearchChange, 500, {
              leading: true,
            })}
            results={results}
            value={value}
          />
            
            (<Button
              onClick={this.createWorkflow}
              floated="right"  
              color="teal"
                size="small">
                Create Workflow
              </Button>
            )
            </Grid.Row>
            </Grid.Column>
      </Grid>
    );
  }
}

export default workFlowHeader;

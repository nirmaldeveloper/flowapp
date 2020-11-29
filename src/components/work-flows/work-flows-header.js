import React from "react";
import _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSitemap,faPlus,faFilter, faSearch } from '@fortawesome/free-solid-svg-icons'
import { Segment,Grid, Header, Icon, Dropdown, Image, Modal, Input, Button,Search } from "semantic-ui-react";
import firebase from "../../firebase";

const source = _.times(5, () => ({
  title: "",
  description: "",
  image: "",
  price: "",
}));

const initialState = { isLoading: false, results: [], value: '' }
class WorkFlowsHeader extends React.Component {
  state={
    user:this.props.currentUser
  }
  handleResultSelect = (e, { result }) => this.setState({ value: result.title })

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value })

    setTimeout(() => {
      if (this.state.value.length < 1) return this.setState(initialState)

      const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
      const isMatch = (result) => re.test(result.title)

      this.setState({
        isLoading: false,
        results: _.filter(source, isMatch),
      })
    }, 300)
  }
  createWorkflow = event =>{
    event.preventDefault();

  }
  
  render() {
    const { isLoading, value, results } = this.state;

    const { primaryColor } = "#ffffff";
    const pathname = window.location.pathname;
    return (
        <Grid style={{ background: primaryColor }}>
        <Grid.Column>
          <Segment stacked>
          <Grid.Row style={{height:"50px", padding: "1.2em", margin: 0 }}>

          <Search
          floated ="left"
          style={{float: "left"}}
            input={{ icon: 'search', iconPosition: 'left' }}
            loading={isLoading}
            onResultSelect={this.handleResultSelect}
            onSearchChange={_.debounce(this.handleSearchChange, 500, {
              leading: true,
            })}
            results={results}
            value={value}
          />
            <Button
              onClick={this.createWorkflow}
              floated="right"  
              color="green"
                size="small">
            <FontAwesomeIcon icon={faPlus} /> &nbsp;
                Create Workflow
              </Button>

            </Grid.Row>
            </Segment>
            </Grid.Column>
      </Grid>
    );
  }
}

export default WorkFlowsHeader;

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

const tagOptions = [
  {
    key: 'All',
    text: 'ALL',
    value: '-1',
    label: { color: 'orange', empty: true, circular: true },
  },
  {
    key: 'Pending',
    text: 'PENDING',
    value: '1',
    label: { color: 'grey', empty: true, circular: true },
  },
  {
    key: 'Completed',
    text: 'COMPLETED',
    value: '2',
    label: { color: 'green', empty: true, circular: true },
  }
]

const initialState = { isLoading: false, results: [], value: '' }
class WorkFlowsHeader extends React.Component {
  constructor(props) {
    super(props);
    };
  state={
    user:this.props.currentUser
  }
  openModal = () =>{
    this.props.openWorkFlowModal();
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
          <Grid.Row style={{height:"30px", margin: 0 }}>

          <Search
            className="customSearch"
            floated ="left"
            style={{ float: "left", paddingRight:"10px"}}
            input={{placeholder:'Search Workflows', icon: 'search', iconPosition: 'left' }}
            loading={isLoading}
            onResultSelect={this.handleResultSelect}
            onSearchChange={_.debounce(this.handleSearchChange, 500, {
              leading: true,
            })}
            results={results}
            value={value}
          />
          <Dropdown style={{float:"left"}} 
                    text='Filter'
                    icon='filter'
                    floated="left"
                    labeled
                    button
                    className='icon'>

          <Dropdown.Menu floated="left">
            {/* <Input icon='search' iconPosition='left' className='search' />
            <Dropdown.Divider />
            <Dropdown.Header icon='tags' content='Tag Label' /> */}
            <Dropdown.Menu scrolling>
              {tagOptions.map((option) => (
                <Dropdown.Item key={option.value} {...option} />
              ))}
            </Dropdown.Menu>
          </Dropdown.Menu>
        </Dropdown>
            <Button
              onClick={this.openModal}
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

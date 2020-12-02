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
    filterText:"Filter",
    user:this.props.currentUser,
    searchTerm: this.props.searchTerm,
    searchLoading:this.props.searchLoading,
    searchResults:this.props.searchResults,
    handleSearchChange: this.props.handleSearchChange,
    handleFilterChange:this.props.handleFilterChange
  }
  openModal = () =>{
    this.props.openWorkFlowModal();
  }
  handleResultSelect = (e, { result }) => this.setState({ value: result.title })

  // handleHeaderSearchChange = (e, { value }) => {
  //   this.setState({ isLoading: true, value })

  //   setTimeout(() => {
  //     this.state.handleSearchChange(e);
  //     this.setState({
  //       isLoading: false,
  //       // results: _.filter(source, isMatch),
  //     })
  //   }, 300)
  // }
  createWorkflow = event =>{
    event.preventDefault();

  }
  optionSelected = option =>{
    if(option.text !== this.state.filterText){
      this.setState({filterText:option.text});
    }
    else{
      this.setState({filterText:"Filter"});
    }
    this.state.handleFilterChange(option.value);
  }
  
  render() {
    const { searchLoading, searchTerm,handleSearchChange,filterText } = this.state;
    const results = this.state.searchResults;

    const { primaryColor } = "#ffffff";
    const pathname = window.location.pathname;
    return (
        <Grid style={{ background: primaryColor }}>
        <Grid.Column>
          <Segment clearing>
          <Grid.Row style={{height:"30px", margin: 0 }}>

          <Search
            name="searchTerm"
            className="customSearch"
            floated ="left"
            style={{ float: "left", paddingRight:"10px"}}
            input={{placeholder:'Search Workflows', icon: 'search', iconPosition: 'left' }}
            loading={searchLoading}
            //onResultSelect={this.handleResultSelect}
            onSearchChange={(e)=>handleSearchChange(e)}
            // onSearchChange={(e)=>_.debounce(this.handleSearchChange(e), 500, {
            //   searchLoading: true,
            // }).this}
            // results={results}
            // value={searchTerm}
          />
          <Dropdown style={{float:"left"}} 
                    text={filterText}
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
                <Dropdown.Item  key={option.value} {...option} onClick={()=>this.optionSelected(option)}/>
              ),this)}
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

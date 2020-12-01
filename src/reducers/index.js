import { combineReducers } from "redux";
import * as actionTypes from "../actions/types";

const initialUserState = {
  currentUser: null,
  isLoading: true
};

const user_reducer = (state = initialUserState, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        currentUser: action.payload.currentUser,
        isLoading: false
      };
    case actionTypes.CLEAR_USER:
      return {
        ...state,
        isLoading: false
      };
    default:
      return state;
  }
};

const initialWorkFlowState = {
  currentWorkFlow: null
};

const workflow_reducer = (state = initialWorkFlowState, action) => {
  switch (action.type) {
    case actionTypes.SET_CURRENT_WORKFLOW:
      return {
        ...state,
        currentWorkFlow: action.payload.currentWorkFlow
      };
    default:
      return state;
  }
};

const initialColorsState = {
  primaryColor: "#4c3c4c",
  secondaryColor: "#eee"
};

const colors_reducer = (state = initialColorsState, action) => {
  switch (action.type) {
    case actionTypes.SET_COLORS:
      return {
        primaryColor: action.payload.primaryColor,
        secondaryColor: action.payload.secondaryColor
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
    user: user_reducer,
    workflow: workflow_reducer,
    colors: colors_reducer
});
  
export default rootReducer;

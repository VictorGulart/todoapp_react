// Import Actions
import {
  // USER LOGIN
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE,

  // USER LOGOUT
  USER_LOGOUT_REQUEST,
  USER_LOGOUT_SUCCESS,
  USER_LOGOUT_FAILURE,

  // USER CREATION
  USER_CREATE_REQUEST,
  USER_CREATE_SUCCESS,
  USER_CREATE_FAILURE,
} from "../action_creators/action_types";

// Create a default state
const initState = {
  loading: false,
  user: {},
  auth: false,
  token: null,
  data: {},
  error: "",
};

export const userReducer = (state = initState, action) => {
  // here is where the states is 'modified' in reality
  // we create a new one and return it

  let { type } = action;

  switch (type) {
    case FETCH_USER_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_USER_SUCCESS:
      let { user, token } = action.payload.data;
      return {
        ...state,
        loading: false,
        user: user,
        token: token,
        auth: true,
      };
    case FETCH_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case USER_LOGOUT_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case USER_LOGOUT_SUCCESS:
      // sets the state back to what it was ?
      // is this right
      return initState;
    case USER_LOGOUT_FAILURE:
      // this should not happen
      console.log("fix log out it you see this message ");

      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case USER_CREATE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case USER_CREATE_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload.data.user,
        token: action.payload.data.token,
        auth: true,
      };
    case USER_CREATE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

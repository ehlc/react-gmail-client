import {
  SIGNED_OUT,
  SIGNED_IN,
  AUTH_SUCCESS,
  AUTH_FAIL,
  AUTH_IN_PROGRESS,
  AUTH_SIGNED_OUT
} from "../constants";

export const signedOutReducer = (state = {}, action) => {
  switch (action.type) {
    case SIGNED_OUT:
      return {};
    default:
      return state;
  }
};

export const signInStatusResult = (state = {}, action) => {
  switch (action.type) {
    case AUTH_IN_PROGRESS:
      return {
        ...state,
        status: AUTH_IN_PROGRESS
      };
    case AUTH_SUCCESS:
      return {
        ...state,
        status: AUTH_SUCCESS,
        currentUser: action.payload.currentUser
      };
    case AUTH_FAIL:
      return {
        ...state,
        status: AUTH_FAIL
      };
    case SIGNED_IN:
      return { ...action.payload };
    case SIGNED_OUT:
    return {
        ...state,
        status: AUTH_SIGNED_OUT,
        currentUser: {}
      };
    default:
      return state;
  }
};

// Assuming jwtFetch is correctly implemented elsewhere
import jwtFetch from "./jwt";

const RECEIVE_USER = "users/RECEIVE_USER";
const RECEIVE_USERS = "users/RECEIVE_USERS";
const RECEIVE_USER_ERRORS = "users/RECEIVE_USER_ERRORS";
const CLEAR_USER_ERRORS = "users/CLEAR_USER_ERRORS"; 
const RECEIVE_CURRENT_USER = "users/RECEIVE_CURRENT_USER"; 

const nullErrors = {}; 

const receiveUser = (user) => ({
    type: RECEIVE_USER,
    user
});

const receiveUsers = (users) => ({
    type: RECEIVE_USERS,
    users
});


export const fetchUser = (userId) => async (dispatch) => {
    try {
      const response = await jwtFetch(`/api/users/${userId}`);
      const user = await response.json();
      dispatch(receiveUser(user)); 
    } catch (error) {
      console.error(error);

    }
};

export const fetchUsers = () => async (dispatch) => {
    try {
      const response = await jwtFetch(`/api/users`);
      const users = await response.json();
      dispatch(receiveUsers(users));
    } catch (error) {
      console.error(error);

    }
};

const usersReducer = (state = { all: {}, user: {}, new: undefined }, action) => {
    const newState = {...state};

    switch(action.type) {
    case RECEIVE_USER:
        newState.user = action.user;
        return newState;

    case RECEIVE_USERS:
        newState.all = {...newState.all, ...action.users};
        return newState;

    default:
        return newState;
    }
};

export const usersErrorsReducer = (state = nullErrors, action) => {
    switch(action.type) {
    case RECEIVE_USER_ERRORS:
      return action.errors;
    case RECEIVE_CURRENT_USER:
    case CLEAR_USER_ERRORS:
      return nullErrors;
    default:
      return state;
  }
};

export default usersReducer;

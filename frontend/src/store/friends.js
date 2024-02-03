import jwtFetch from './jwt';

const SEND_FRIEND_REQUEST = "friends/SEND_FRIEND_REQUEST"
const ACCEPT_FRIEND_REQUEST = "friends/ACCEPT_FRIEND_REQUEST"
const REJECT_FRIEND_REQUEST = "friends/REJECT_FRIEND_REQUEST"
const UNFRIEND = "friends/UNFRIEND"

export const sendFriendRequest = (friend,senderId) => ({
    type: SEND_FRIEND_REQUEST,
    payload:{friend,senderId}
  });
  
  export const acceptFriendRequest = (friend) => ({
    type: ACCEPT_FRIEND_REQUEST,
    payload: friend,
  });
  
  export const rejectFriendRequest = (friend) => ({
    type: REJECT_FRIEND_REQUEST,
    payload: friend,
  });

  export const unFriend = (friend) => ({
    type: UNFRIEND,
    payload: friend,
  })

  export const sendFriendRequestThunk = (friendId, senderId) => async (dispatch) => {
    try {
      const response = await jwtFetch(`api/users/${friendId}/friend`, {
        method: 'PATCH',
      });
  
      const data  = await response.json();
      dispatch(sendFriendRequest(data, senderId));
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };
  
  export const acceptFriendRequestThunk = (friendId) => async (dispatch) => {
    try {
      const response = await jwtFetch(`api/users/${friendId}/accept`, {
        method: 'PATCH',
      });
  
      const data  = await response.json();
      dispatch(acceptFriendRequest(data));
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };
  
  export const rejectFriendRequestThunk = (friendId) => async (dispatch) => {
    try {
      const response = await jwtFetch(`api/users/${friendId}/reject`, {
        method: 'PATCH',
      });
  
      const  data  = await response.json();
      dispatch(rejectFriendRequest(data));
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };

  export const unfriendThunk = (friendId) => async (dispatch) => {
    try {
      const response = await jwtFetch(`api/users/${friendId}/unfriend`, {
        method: 'PATCH',
      });
  
      const data = await response.json();
      dispatch(unFriend(data));
    } catch (error) {
      console.error('Error unfriending user:', error);
    }
  };

  const initialState = {
    friendRequests: [],
    friends: [],
  };
  
  const friendReducer = (state = initialState, action) => {
    switch (action.type) {
      case SEND_FRIEND_REQUEST:
        return {
          ...state,
          friendRequests: [...state.friendRequests,action.payload.senderId],
        };
  
      case ACCEPT_FRIEND_REQUEST:
        return {
          ...state,
          friendRequests: state.friendRequests.filter((friend) => friend !== action.payload._id),
          friends: [...state.friends, action.payload],
        };
  
      case REJECT_FRIEND_REQUEST:
        return {
          ...state,
          friendRequests: state.friendRequests.filter((friend) => friend._id !== action.payload._id),
        };
      case UNFRIEND:
          return {
            ...state,
            friends: state.friends.filter((friend) => friend._id !== action.payload._id),
        };
  
      default:
        return state;
    }
  };
  
  export default friendReducer;
  
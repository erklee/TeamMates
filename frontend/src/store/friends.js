import jwtFetch from './jwt';

const SEND_FRIEND_REQUEST = "friends/SEND_FRIEND_REQUEST"
const ACCEPT_FRIEND_REQUEST = "friends/ACCEPT_FRIEND_REQUEST"
const REJECT_FRIEND_REQUEST = "friends/REJECT_FRIEND_REQUEST"
const UNFRIEND = "friends/UNFRIEND"

export const sendFriendRequest = (senderId) => ({
  type: SEND_FRIEND_REQUEST,
  payload: senderId,
});

export const acceptFriendRequest = (senderId) => ({
  type: ACCEPT_FRIEND_REQUEST,
  payload: senderId,
});

export const rejectFriendRequest = (senderId) => ({
  type: REJECT_FRIEND_REQUEST,
  payload: senderId,
});

  export const unFriend = (friend) => ({
    type: UNFRIEND,
    payload: friend,
  })

  export const sendFriendRequestThunk = (friendId) => async (dispatch) => {
    try {
      const response = await jwtFetch(`api/users/${friendId}/friend`, {
        method: 'PATCH',
      });
  
      const data = await response.json();
      dispatch(sendFriendRequest(data.sender));
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };
  
  

export const acceptFriendRequestThunk = (friendId) => async (dispatch) => {
  try {
    const response = await jwtFetch(`/api/users/${friendId}/accept`, {
      method: 'PATCH',
    });

    if (response.ok) {
      const data = await response.json();
      const senderData = data.sender || {}; 
      dispatch(acceptFriendRequest(senderData));
    } else {
      const data = await response.json();
      console.error('Error accepting friend request:', data.errors || 'Unknown error');
    }
  } catch (error) {
    console.error('Error accepting friend request:', error.message || 'Unknown error');
  }
};

  
  

  
export const rejectFriendRequestThunk = (friendId) => async (dispatch) => {
  try {
    const response = await jwtFetch(`api/users/${friendId}/reject`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      if (data.sender) {
        dispatch(rejectFriendRequest(data.sender));
      } else {
        console.error('Error rejecting friend request: Sender data not found in the response');
      }
    } else {
      console.error('Error rejecting friend request:', data.message);
    }
  } catch (error) {
    console.error('Error rejecting friend request:', error);
  }
};

export const unfriendThunk = (friendId) => async (dispatch) => {
  try {
    const response = await jwtFetch(`api/users/${friendId}/unfriend`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      dispatch(unFriend(data));
    } else {
      console.error('Error unfriending user:', data.message);
    }
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
        friendRequests: [...state.friendRequests, action.payload],
      };
      case ACCEPT_FRIEND_REQUEST:
        return {
          ...state,
          friendRequests: state.friendRequests.filter((friend) => friend?._id !== action.payload._id),
          friends: [...state.friends, action.payload],
        };

    case REJECT_FRIEND_REQUEST:
      return {
        ...state,
        friendRequests: state.friendRequests.filter((friendId) => friendId !== action.payload),
      };
    case UNFRIEND:
      return {
        ...state,
        friendRequests: state.friends.filter((friendId) => friendId !== action.payload),
      };
    default:
      return state

    // ... other cases
  }
};
  
  export default friendReducer;
  
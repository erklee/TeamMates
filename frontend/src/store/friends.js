import jwtFetch from './jwt';

const SEND_FRIEND_REQUEST = "friends/SEND_FRIEND_REQUEST"
const ACCEPT_FRIEND_REQUEST = "friends/ACCEPT_FRIEND_REQUEST"
const REJECT_FRIEND_REQUEST = "friends/REJECT_FRIEND_REQUEST"
const UNFRIEND = "friends/UNFRIEND"

const FETCH_INCOMING_FRIEND_REQUESTS_SUCCESS = 'friends/FETCH_INCOMING_FRIEND_REQUESTS_SUCCESS';
const FETCH_OUTGOING_FRIEND_REQUESTS_SUCCESS = 'friends/FETCH_OUTGOING_FRIEND_REQUESTS_SUCCESS';
const SEND_FRIEND_REQUEST_SUCCESS = 'friends/SEND_FRIEND_REQUEST_SUCCESS';

export const fetchIncomingFriendRequests = () => async (dispatch) => {
  try {
    const response = await jwtFetch('/api/friendRequests/incoming'); // Adjust the endpoint as necessary
    if (!response.ok) {
      throw new Error('Failed to fetch incoming friend requests');
    }
    const incomingRequests = await response.json();
    dispatch({
      type: FETCH_INCOMING_FRIEND_REQUESTS_SUCCESS,
      payload: incomingRequests,
    });
  } catch (error) {
    console.error('Error fetching incoming friend requests:', error);
    // Handle error state if necessary
  }
};

export const fetchOutgoingFriendRequests = () => async (dispatch) => {
  try {
    const response = await jwtFetch('/api/friendRequests/outgoing'); // Adjust the endpoint as necessary
    if (!response.ok) {
      throw new Error('Failed to fetch outgoing friend requests');
    }
    const outgoingRequests = await response.json();
    dispatch({
      type: FETCH_OUTGOING_FRIEND_REQUESTS_SUCCESS,
      payload: outgoingRequests,
    });
  } catch (error) {
    console.error('Error fetching outgoing friend requests:', error);
    // Handle error state if necessary
  }
};

export const fetchAllFriendRequests = () => async (dispatch) => {
  try {
    // Assuming an endpoint that returns the current user's friends and friend requests
    const response = await jwtFetch('/api/users/me/friendsAndRequests');
    if (!response.ok) {
      throw new Error('Failed to fetch friend requests data');
    }
    const data = await response.json();
    // Dispatch actions or update state based on the fetched data
    // This example assumes the response includes structured data for incoming and outgoing requests
    dispatch({
      type: FETCH_FRIEND_REQUESTS_SUCCESS, // You might need to define this action type
      payload: {
        incomingRequests: data.incomingRequests,
        outgoingRequests: data.outgoingRequests,
        friends: data.friends,
      },
    });
  } catch (error) {
    console.error('Error fetching friend requests:', error);
    // Handle error state if necessary
  }
};




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
    // try {
    //   const response = await jwtFetch(`api/users/${friendId}/friend`, {
    //     method: 'PATCH',
    //   });
  
    //   const data = await response.json();
    //   dispatch(sendFriendRequest(data.sender));
    // } catch (error) {
    //   console.error('Error sending friend request:', error);
    // }

    try {
      const response = await jwtFetch(`api/users/${friendId}/friend`, { method: 'PATCH' });
      if (!response.ok) {
        throw new Error('Failed to send friend request');
      }
      // Assuming the response body contains the friendId or some success indicator
      dispatch({ type: SEND_FRIEND_REQUEST_SUCCESS, payload: { friendId } });
    } catch (error) {
      console.error('Error sending friend request:', error);
      // Optionally dispatch an error handling action here
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
  outgoingFriendRequests: [],
  incomingFriendRequests: [],
  friendRequests: [],
  friends: [],
};

const friendReducer = (state = initialState, action) => {
  switch (action.type) {

    case FETCH_INCOMING_FRIEND_REQUESTS_SUCCESS:
      return {
        ...state,
        incomingFriendRequests: action.payload,
      };

    case FETCH_OUTGOING_FRIEND_REQUESTS_SUCCESS:
      return {
        ...state,
        outgoingFriendRequests: action.payload,
      };

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

      case SEND_FRIEND_REQUEST_SUCCESS:
        return {
          ...state,
          outgoingFriendRequests: [...state.outgoingFriendRequests, action.payload.friendId],
        };

    default:
      return state

    // ... other cases
  }
};
  
  export default friendReducer;
  
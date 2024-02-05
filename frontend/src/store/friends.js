import jwtFetch from './jwt';

const SEND_FRIEND_REQUEST = "friends/SEND_FRIEND_REQUEST"
const ACCEPT_FRIEND_REQUEST = "friends/ACCEPT_FRIEND_REQUEST"
const REJECT_FRIEND_REQUEST = "friends/REJECT_FRIEND_REQUEST"
const UNFRIEND = "friends/UNFRIEND"
const GET_FRIEND_REQUESTS = "friends/GET_FRIEND_REQUESTS";
const GET_FRIENDS = "friends/GET_FRIENDS";

const FETCH_INCOMING_FRIEND_REQUESTS_SUCCESS = 'friends/FETCH_INCOMING_FRIEND_REQUESTS_SUCCESS';
const FETCH_OUTGOING_FRIEND_REQUESTS_SUCCESS = 'friends/FETCH_OUTGOING_FRIEND_REQUESTS_SUCCESS';
const SEND_FRIEND_REQUEST_SUCCESS = 'friends/SEND_FRIEND_REQUEST_SUCCESS';

const UPDATE_FRIEND_REQUESTS = 'friends/UPDATE_FRIEND_REQUESTS';

export const updateFriendRequests = (updatedData) => ({
  type: UPDATE_FRIEND_REQUESTS,
  payload: updatedData,
});

export const sendFriendRequestThunk = (friendId) => async (dispatch) => {
  try {
    const response = await jwtFetch(`/api/users/${friendId}/friend`, { method: 'PATCH' });
    if (!response.ok) {
      throw new Error('Failed to send friend request');
    }
    const updatedData = await response.json();
    // Dispatch an action to update Redux store based on updatedData
    dispatch(updateFriendRequests(updatedData)); // Now correctly defined
  } catch (error) {
    console.error('Error sending friend request:', error);
  }
};

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

export const getFriendRequests = (friendRequests) => ({
  type: GET_FRIEND_REQUESTS,
  payload: friendRequests,
});

export const getFriends = (friends) => ({
  type: GET_FRIENDS,
  payload: friends,
});

  // export const sendFriendRequestThunk = (friendId) => async (dispatch) => {
  //   // try {
  //   //   const response = await jwtFetch(`api/users/${friendId}/friend`, {
  //   //     method: 'PATCH',
  //   //   });
  
  //   //   const data = await response.json();
  //   //   dispatch(sendFriendRequest(data.sender));
  //   // } catch (error) {
  //   //   console.error('Error sending friend request:', error);
  //   // }

  //   // try {
  //   //   const response = await jwtFetch(`api/users/${friendId}/friend`, { method: 'PATCH' });
  //   //   if (!response.ok) {
  //   //     throw new Error('Failed to send friend request');
  //   //   }
  //   //   // Assuming the response body contains the friendId or some success indicator
  //   //   dispatch({ type: SEND_FRIEND_REQUEST_SUCCESS, payload: { friendId } });
  //   // } catch (error) {
  //   //   console.error('Error sending friend request:', error);
  //   //   // Optionally dispatch an error handling action here
  //   // }

  //   try {
  //     const response = await jwtFetch(`api/users/${friendId}/friend`, { method: 'PATCH' });
  //     if (!response.ok) {
  //       throw new Error('Failed to send friend request');
  //     }
  //     const updatedData = await response.json();
  //     // Dispatch an action to update Redux store based on updatedData
  //     dispatch(updateFriendRequests(updatedData)); // Assume updateFriendRequests is an action creator that updates the store
  //   } catch (error) {
  //     console.error('Error sending friend request:', error);
  //   }
  // };
  
  

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

export const getFriendRequestsThunk = () => async (dispatch) => {
  try {
    const response = await jwtFetch('api/users/current');
    const currentUser = await response.json();

    
    if (!currentUser || !currentUser._id) {
      console.error('User ID not available');
      return;
    }

    const friendRequestsResponse = await jwtFetch(`api/users/friend-requests/${currentUser._id}`);
    const friendRequestsData = await friendRequestsResponse.json();
    dispatch(getFriendRequests(friendRequestsData));
  } catch (error) {
    console.error('Error fetching friend requests:', error);
  }
};

export const getFriendsThunk = () => async (dispatch) => {
  try {
    const response = await jwtFetch('api/users/current');
    const currentUser = await response.json();

   
    if (!currentUser || !currentUser._id) {
      console.error('User ID not available');
      return;
    }

    const friendsResponse = await jwtFetch(`api/users/friends/${currentUser._id}`);
    const friendsData = await friendsResponse.json();

    dispatch(getFriends(friendsData));
  } catch (error) {
    console.error('Error fetching friends:', error);
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
        friends: state.friends.filter((friendId) => friendId !== action.payload),
      };
    case GET_FRIEND_REQUESTS:
      return {
        ...state,
        friendRequests: action.payload,
      };
    case GET_FRIENDS:
      return {
        ...state,
        friends: action.payload,
      };

      case SEND_FRIEND_REQUEST_SUCCESS:
    // Ensure that only valid IDs are added to the outgoingFriendRequests array.
    if (action.payload) { // Assuming payload is the friend request ID or relevant data
        return {
            ...state,
            outgoingFriendRequests: [...state.outgoingFriendRequests, action.payload].filter(Boolean), // The .filter(Boolean) removes falsy values
        };
    }
    return state;

      // case SEND_FRIEND_REQUEST_SUCCESS:
      //   return {
      //     ...state,
      //     outgoingFriendRequests: [...state.outgoingFriendRequests, action.payload.friendId],
      //   };

    //   case SEND_FRIEND_REQUEST_SUCCESS:
    // // Assuming the action.payload is the friend request ID
    // return {
    //     ...state,
    //     outgoingFriendRequests: [...state.outgoingFriendRequests, action.payload]
    // };

        // case UPDATE_FRIEND_REQUESTS:
        //   const { outgoingFriendRequest } = action.payload;
        //   return {
        //     ...state,
        //     outgoingFriendRequests: [...state.outgoingFriendRequests, outgoingFriendRequest],
        //   };
        case UPDATE_FRIEND_REQUESTS:
          const { outgoingFriendRequest } = action.payload; // Assuming this is the correct structure
          return {
              ...state,
              outgoingFriendRequests: state.outgoingFriendRequests.concat(outgoingFriendRequest)
          };
    default:
      return state

  }
};
  
  export default friendReducer;
  
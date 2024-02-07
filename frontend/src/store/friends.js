import jwtFetch from './jwt';

const SEND_FRIEND_REQUEST = "friends/SEND_FRIEND_REQUEST"
const ACCEPT_FRIEND_REQUEST = "friends/ACCEPT_FRIEND_REQUEST"
const REJECT_FRIEND_REQUEST = "friends/REJECT_FRIEND_REQUEST"
const UNFRIEND = "friends/UNFRIEND"
const GET_FRIEND_REQUESTS = "friends/GET_FRIEND_REQUESTS";
const GET_FRIENDS = "friends/GET_FRIENDS";

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

  export const sendFriendRequestThunk = (friendId) => async (dispatch) => {
    try {
      const response = await jwtFetch(`/api/users/${friendId}/friend`, {
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
      dispatch(getFriendRequestsThunk())
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
    const response = await jwtFetch(`/api/users/${friendId}/reject`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      if (data.sender) {
        dispatch(getFriendRequestsThunk())
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
    const response = await jwtFetch(`/api/users/${friendId}/unfriend`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      dispatch(unFriend(data));
      dispatch(getFriendsThunk())
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
    const response = await jwtFetch('api/users/current')
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
          friendRequests: state.friendRequests.filter(friend => friend._id !== action.payload._id),
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
    default:
      return state

  }
};
  
  export default friendReducer;
  
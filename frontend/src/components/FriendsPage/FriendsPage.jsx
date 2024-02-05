import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFriendsThunk, fetchIncomingFriendRequests  } from '../../store/friends'; // Adjust the import path as necessary
import UserItem from '../UserIndexPage/UserItem/UserItem';

const FriendsPage = () => {
    const dispatch = useDispatch();
    const friends = useSelector(state => state.friends.friends); // Assuming this gets the list of friends
    const incomingRequests = useSelector(state => state.friends.incomingFriendRequests); // Adjust based on your state structure
  
    useEffect(() => {
      dispatch(getFriendsThunk()); // Fetch all friends of the current user
      dispatch(fetchIncomingFriendRequests()); // Fetch all incoming friend requests
    }, [dispatch]);
  
    return (
      <div>
        <h2>My Friends</h2>
        <ul>
          {friends.map(friend => (
            <UserItem key={friend._id} user={friend} isFriend={true} />
          ))}
        </ul>
  
        <h2>Incoming Friend Requests</h2>
        <ul>
          {incomingRequests.map(request => (
            // Assuming request structure has a 'sender' object or similar
            <UserItem key={request._id} user={request.sender} isFriend={false} />
          ))}
        </ul>
      </div>
    );
  };
  
export default FriendsPage;

  
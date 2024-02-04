import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchIncomingFriendRequests,
  fetchOutgoingFriendRequests,
  acceptFriendRequestThunk,
  rejectFriendRequestThunk,
} from '../../store/friends';

const FriendsPage = () => {
  const dispatch = useDispatch();
  const friends = useSelector(state => state.friends.friends);
  const incomingRequests = useSelector(state => state.friends.incomingFriendRequests);
  const outgoingRequests = useSelector(state => state.friends.outgoingFriendRequests);

  useEffect(() => {
    dispatch(fetchIncomingFriendRequests());
    dispatch(fetchOutgoingFriendRequests());
  }, [dispatch]);

  // Handler for accepting friend requests
  const handleAccept = (requestId) => {
    dispatch(acceptFriendRequestThunk(requestId));
  };

  // Handler for rejecting friend requests
  const handleReject = (requestId) => {
    dispatch(rejectFriendRequestThunk(requestId));
  };

  return (
    <div>
      <h2>My Friends</h2>
      <ul>
        {friends.map(friend => (
          <li key={friend._id}>{friend.name}</li>
        ))}
      </ul>
      <h2>Incoming Friend Requests</h2>
      <ul>
        {incomingRequests.map(request => (
          <li key={request._id}>
            {request.sender.name}
            <button onClick={() => handleAccept(request._id)}>Accept</button>
            <button onClick={() => handleReject(request._id)}>Decline</button>
          </li>
        ))}
      </ul>
      <h2>Outgoing Friend Requests</h2>
      <ul>
        {outgoingRequests.map(request => (
          <li key={request._id}>{request.recipient.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default FriendsPage;

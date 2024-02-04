import { useDispatch, useSelector } from "react-redux";
import { sendFriendRequestThunk, unfriendThunk, acceptFriendRequestThunk } from "../../../store/friends";
import { useState } from "react";

const UserItem = ({ user }) => {
    const dispatch = useDispatch();
    const [requestStatus, setRequestStatus] = useState('none'); // Local state to track the request status
  
    // Retrieve the state from Redux
    const friendRequestsSent = useSelector(state => state.friends.outgoingFriendRequests || []);
    const friendRequestsReceived = useSelector(state => state.friends.incomingFriendRequests || []);
    const friendsList = useSelector(state => state.friends.friends || []);
  
    // Determine the friend request and friendship status
    const isFriend = friendsList.includes(user._id);
    const isRequestSent = friendRequestsSent.includes(user._id);
    const isRequestReceived = friendRequestsReceived.includes(user._id);
  
    // Function to handle sending friend requests
    const handleSendFriendRequest = () => {
      setRequestStatus('pending'); // Optimistically set to 'pending'
      dispatch(sendFriendRequestThunk(user._id))
        .then(() => {
          // Here, you might update Redux state or leave as is for optimistic UI update
        })
        .catch(() => {
          setRequestStatus('none'); // Reset on error
        });
    };
  
    // Functions for accepting friend requests and unfriending
    const handleAcceptFriendRequest = () => {
      dispatch(acceptFriendRequestThunk(user._id));
    };
  
    const handleUnfriend = () => {
      dispatch(unfriendThunk(user._id));
    };
  
    // Logic to determine which button to render
    const renderActionButton = () => {
      const showPending = requestStatus === 'pending' || isRequestSent;
      if (isFriend) {
        return <button onClick={handleUnfriend}>Unfriend</button>;
      } else if (isRequestReceived) {
        return <button onClick={handleAcceptFriendRequest}>Accept</button>;
      } else if (showPending) {
        return <span>Pending</span>;
      } else {
        return <button onClick={handleSendFriendRequest}>Send Friend Request</button>;
      }
    };
  
    return (
      <li>
        {user.fname} {user.lname} - {renderActionButton()}
      </li>
    );
  };

export default UserItem
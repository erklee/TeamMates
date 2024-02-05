

import { useDispatch, useSelector } from "react-redux";
import { sendFriendRequestThunk, unfriendThunk, rejectFriendRequestThunk, acceptFriendRequestThunk } from "../../../store/friends";
import { useState, useEffect } from "react";

const UserItem = ({ user }) => {
  const dispatch = useDispatch();
  const friends = useSelector((state) => state.friends.friends);
  const outgoingFriendRequests = useSelector((state) => state.friends.outgoingFriendRequests);
  const incomingFriendRequests = useSelector((state) => state.friends.incomingFriendRequests);

  // Determine the initial friend status
  const getInitialFriendStatus = () => {
    if (friends.some((friend) => friend._id === user._id)) return "friends";
    if (outgoingFriendRequests.some((request) => request === user._id)) return "pending";
    if (incomingFriendRequests.some((request) => request === user._id)) return "request_received";
    return "none";
  };

  const [friendStatus, setFriendStatus] = useState(getInitialFriendStatus);

  useEffect(() => {
    setFriendStatus(getInitialFriendStatus()); // Update friend status based on changes
  }, [friends, outgoingFriendRequests, incomingFriendRequests, user._id]);

  const handleFriendAction = async (actionThunk) => {
    try {
      await dispatch(actionThunk(user._id));
      // Optionally refresh friend states here
    } catch (error) {
      console.error("Action failed:", error);
      // Display error message to user
    }
  };

  const renderActionButton = () => {
    switch (friendStatus) {
      case "friends":
        return <button onClick={() => handleFriendAction(unfriendThunk)}>Unfriend</button>;
        case "request_received":
          return (
              <>
                  <button onClick={() => handleFriendAction(acceptFriendRequestThunk)}>Accept Request</button>
                  <button onClick={() => handleFriendAction(rejectFriendRequestThunk)}>Reject Request</button>
              </>
          );
      case "pending":
        return <span>Request Sent</span>;
      default:
        return <button onClick={() => handleFriendAction(sendFriendRequestThunk)}>Send Friend Request</button>;
    }
  };

  return (
    <li>
      {user.fname} {user.lname} / {user.username} / ({user.email}) - {renderActionButton()}
    </li>
  );
};

export default UserItem;


// const UserItem = ({ user }) => {
//   const dispatch = useDispatch();
//   const friends = useSelector(state => state.friends.friends);
//   const outgoingFriendRequests = useSelector(state => state.friends.outgoingFriendRequests);
//   const incomingFriendRequests = useSelector(state => state.friends.incomingFriendRequests);
//   const [buttonState, setButtonState] = useState('Send Friend Request');

//   useEffect(() => {
//     if (outgoingFriendRequests.includes(user._id)) {
//       setButtonState('Pending');
//     }
//     // Add logic for other states like "Friends" based on your state structure
//   }, [user._id, outgoingFriendRequests]);

  

//   // Determine the current status based on Redux state
//   const currentStatus = () => {
//     if (friends.some(friend => friend._id === user._id)) return 'friends';
//     if (outgoingFriendRequests.some(request => request === user._id)) return 'pending';
//     if (incomingFriendRequests.some(request => request === user._id)) return 'request_received';
//     return 'none';
//   };

//   const [localFriendStatus, setLocalFriendStatus] = useState(currentStatus());

  

//   useEffect(() => {
//     // Update local state based on Redux state to ensure persistence
//     setLocalFriendStatus(currentStatus());
//   }, [friends, outgoingFriendRequests, incomingFriendRequests, user._id]);

//   const handleAction = (action) => {
//     dispatch(action).then(() => {
//       // Optionally, force refresh the friend states after action
//       // For example, you might re-fetch the friends list
//     }).catch((error) => {
//       console.error('Action failed:', error);
//     });
//   };

//   const renderActionButton = () => {
//     switch (localFriendStatus) {
//       case 'friends':
//         return <button onClick={() => handleAction(unfriendThunk(user._id))}>Unfriend</button>;
//       case 'request_received':
//         return <button onClick={() => handleAction(acceptFriendRequestThunk(user._id))}>Accept Request</button>;
//       case 'pending':
//         return <span>Request Sent</span>;
//       default:
//         return <button onClick={() => handleAction(sendFriendRequestThunk(user._id))}>Send Friend Request</button>;
//     }
//   };

//   return (
//     <li>
//       {user.fname} {user.lname} / {user.username} / ({user.email}) - {renderActionButton()}
//     </li>
//   );
// };

// export default UserItem;

// const UserItem = ({ user }) => {
//   const dispatch = useDispatch();
//   const [localFriendStatus, setLocalFriendStatus] = useState('none');

//   const friends = useSelector(state => state.friends.friends);
//   const outgoingFriendRequests = useSelector(state => state.friends.outgoingFriendRequests);
//   const incomingFriendRequests = useSelector(state => state.friends.incomingFriendRequests);

//   useEffect(() => {
//       // Update localFriendStatus based on Redux state
//       // This logic assumes you have user IDs in the friends and requests arrays
//       if (friends.find(friend => friend._id === user._id)) {
//           setLocalFriendStatus('friends');
//       } else if (outgoingFriendRequests.find(request => request === user._id)) {
//           setLocalFriendStatus('pending');
//       } else if (incomingFriendRequests.find(request => request === user._id)) {
//           setLocalFriendStatus('request_received');
//       } else {
//           setLocalFriendStatus('none');
//       }
//   }, [friends, outgoingFriendRequests, incomingFriendRequests, user._id]);

//   const handleSendFriendRequest = () => {
//       dispatch(sendFriendRequestThunk(user._id)).then(() => {
//           // Assume the thunk action resolves after completing the request
//           // You might need to adjust this depending on your implementation
//           setLocalFriendStatus('pending');
//       }).catch((error) => {
//           console.error('Failed to send friend request:', error);
//           // Optionally reset the local status or handle the error
//       });
//   };

//   const handleAcceptFriendRequest = () => {
//     dispatch(acceptFriendRequestThunk(user._id));
//     setLocalFriendStatus("friends"); // Immediate feedback
//   };

//   const handleUnfriend = () => {
//     dispatch(unfriendThunk(user._id));
//     setLocalFriendStatus("none"); // Immediate feedback
//   };

//   const renderActionButton = () => {
//       switch (localFriendStatus) {
//           case 'friends':
//               return <button onClick={handleUnfriend}>Unfriend</button>;
//           case 'request_received':
//               return <button onClick={handleAcceptFriendRequest}>Accept Request</button>;
//           case 'pending':
//               return <span>Request Sent</span>;
//           default:
//               return <button onClick={handleSendFriendRequest}>Send Friend Request</button>;
//       }
//   };

//   return (
//       <li>
//           {user.fname} {user.lname} / {user.username} / ({user.email}) - {renderActionButton()}
//       </li>
//   );
// };

// export default UserItem

// const UserItem = ({ user }) => {
//   const dispatch = useDispatch();
//   // Local state to track the request status for immediate UI updates
//   const [localFriendStatus, setLocalFriendStatus] = useState("none");

//   const friends = useSelector(state => state.friends.friends);
//   const outgoingFriendRequests = useSelector(state => state.friends.outgoingFriendRequests);
//   const incomingFriendRequests = useSelector(state => state.friends.incomingFriendRequests);

//   // Check the global state to determine the current status
//   useEffect(() => {
//     if (friends.some(friend => friend._id === user._id)) {
//       setLocalFriendStatus("friends");
//     } else if (outgoingFriendRequests.some(request => request.toUser === user._id)) {
//       setLocalFriendStatus("pending");
//     } else if (incomingFriendRequests.some(request => request.fromUser === user._id)) {
//       setLocalFriendStatus("request_received");
//     } else {
//       setLocalFriendStatus("none");
//     }
//   }, [friends, outgoingFriendRequests, incomingFriendRequests, user._id]);

//   const handleSendFriendRequest = () => {
//     dispatch(sendFriendRequestThunk(user._id));
//     setLocalFriendStatus("pending"); // Immediate feedback
//   };

//   const handleAcceptFriendRequest = () => {
//     dispatch(acceptFriendRequestThunk(user._id));
//     setLocalFriendStatus("friends"); // Immediate feedback
//   };

//   const handleUnfriend = () => {
//     dispatch(unfriendThunk(user._id));
//     setLocalFriendStatus("none"); // Immediate feedback
//   };

//   const renderActionButton = () => {
//     switch (localFriendStatus) {
//       case "friends":
//         return <button onClick={handleUnfriend}>Unfriend</button>;
//       case "request_received":
//         return <button onClick={handleAcceptFriendRequest}>Accept Request</button>;
//       case "pending":
//         return <span>Request Sent</span>;
//       default:
//         return <button onClick={handleSendFriendRequest}>Send Friend Request</button>;
//     }
//   };

//   return (
//     <li>
//       {user.fname} {user.lname} / {user.username} / ({user.email}) - {renderActionButton()}
//     </li>
//   );
// };

// export default UserItem;

// const UserItem = ({ user }) => {
//     const dispatch = useDispatch();
//     const [requestStatus, setRequestStatus] = useState('none'); // local state to track the request status
  

//     const friendRequestsSent = useSelector(state => state.friends.outgoingFriendRequests || []);
//     const friendRequestsReceived = useSelector(state => state.friends.incomingFriendRequests || []);
//     const friendsList = useSelector(state => state.friends.friends || []);
  
//     const isFriend = friendsList.includes(user._id);
//     const isRequestSent = friendRequestsSent.includes(user._id);
//     const isRequestReceived = friendRequestsReceived.includes(user._id);
  
//     const handleSendFriendRequest = () => {
//       setRequestStatus('pending');
//       dispatch(sendFriendRequestThunk(user._id))
//         .then(() => {

//         })
//         .catch(() => {
//           setRequestStatus('none'); 
//         });
//     };
  

//     const handleAcceptFriendRequest = () => {
//       dispatch(acceptFriendRequestThunk(user._id));
//     };
  
//     const handleUnfriend = () => {
//       dispatch(unfriendThunk(user._id));
//     };

//     const renderActionButton = () => {
//       const showPending = requestStatus === 'pending' || isRequestSent;
//       if (isFriend) {
//         return <button onClick={handleUnfriend}>Unfriend</button>;
//       } else if (isRequestReceived) {
//         return <button onClick={handleAcceptFriendRequest}>Accept</button>;
//       } else if (showPending) {
//         return <span>Pending</span>;
//       } else {
//         return <button onClick={handleSendFriendRequest}>Send Friend Request</button>;
//       }
//     };
  
//     return (
//       <li>
//         {user.fname} {user.lname} / {user.username} / ({user.email}) - {renderActionButton()}
//       </li>
//     );
//   };

// export default UserItem
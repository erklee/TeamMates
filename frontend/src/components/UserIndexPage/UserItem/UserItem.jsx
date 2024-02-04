import { useDispatch, useSelector } from "react-redux";
import { sendFriendRequestThunk, unfriendThunk } from "../../../store/friends";

const UserItem = ({ user }) => {
    const dispatch = useDispatch();
  
    const handleSendFriendRequest = () => {
      dispatch(sendFriendRequestThunk(user._id));
    };
  
    const handleAcceptFriendRequest = () => {
      dispatch(acceptFriendRequestThunk(user._id));
    };
  
    const handleUnfriend = () => {
      dispatch(unfriendThunk(user._id));
    };
  
    const renderActionButton = () => {
      if (user.isFriend) {
        return <button onClick={handleUnfriend}>Unfriend</button>;
      } else if (user.friendRequestStatus === "received") {
        return <button onClick={handleAcceptFriendRequest}>Accept</button>;
      } else if (user.friendRequestStatus === "pending") {
        // Optionally provide a way to cancel the friend request here
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
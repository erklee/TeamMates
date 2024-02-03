import { useDispatch, useSelector } from "react-redux";
import { sendFriendRequestThunk, unfriendThunk } from "../../../store/friends";

const UserItem = ({ user }) => {
    const dispatch = useDispatch();
    const currentUserId = useSelector(state => state.session.user?._id);
    const friends = useSelector(state => state.friends.friends); 
    const isFriend = friends.some(friend => friend._id === user._id);
    
    const handleFriendButtonClick = () => {
        if (isFriend) {
          dispatch(unfriendThunk(user._id));
        } else {
          dispatch(sendFriendRequestThunk(user._id));
        }
      };
    
      return (
        <li>
          {user.fname} {user.lname} ({user.username}) - {user.email}
          <button onClick={handleFriendButtonClick}>
            {isFriend ? 'Remove Friend' : 'Add Friend'}
          </button>
        </li>
      );
    };
    
    export default UserItem;
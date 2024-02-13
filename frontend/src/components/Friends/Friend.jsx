import { useDispatch } from "react-redux";
import { unfriendThunk } from "../../store/friends";
import { useNavigate} from 'react-router-dom'
import './Friend.css';

const Friend = (friend) => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
    const handleProfilePage = e => {
    e.preventDefault()
    navigate(`/profile/${friend.friend._id}`)
  }

  return(
        
    <div className="friendsIndexItemContainer">
      <img onClick={handleProfilePage} src={friend.friend.profileImageUrl} alt="profilepic" className="friendsProfilePic"/>
      <div className="friendsInfoContainer">
        <p>{friend?.friend?.fname} {friend?.friend?.lname}
        </p>
        <p>{friend.friend.username}</p>
      </div>
        <button onClick={() => dispatch(unfriendThunk(friend?.friend?._id))} className="unfriendButton">Unfriend</button>

    </div>
  );
};
export default Friend;
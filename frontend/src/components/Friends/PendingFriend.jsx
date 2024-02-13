import { useDispatch } from "react-redux";
import { useNavigate} from 'react-router-dom'
import { acceptFriendRequestThunk, rejectFriendRequestThunk } from "../../store/friends";
import "./PendingFriend.css";


const PendingFriend = (friendrequest) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleProfilePage = e => {
    e.preventDefault()
    navigate(`/profile/${friendrequest.friendrequest._id}`)
  }

  return(
    <div className="pendingFriendContainer">
      <img onClick={handleProfilePage} src={friendrequest?.friendrequest?.profileImageUrl} alt="" />
      <div className="pendingFriendInfoContainer">
        <p>{friendrequest?.friendrequest?.fname} {friendrequest?.friendrequest?.lname}</p>
        <button className="friendRequestActionBtn"onClick={() => dispatch(rejectFriendRequestThunk(String(friendrequest?.friendrequest?._id)))}>Reject</button>
        <button className="friendRequestActionBtn" onClick={() => dispatch(acceptFriendRequestThunk(String(friendrequest?.friendrequest?._id)))}>Accept</button>
      </div>
    </div>
  );
};

export default PendingFriend


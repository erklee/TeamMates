import { useDispatch } from "react-redux"
import { acceptFriendRequestThunk, rejectFriendRequestThunk } from "../../store/friends"

const PendingFriend = (friendrequest) => {
    const dispatch = useDispatch()
    return(
        <div>
            <span>{friendrequest?.friendrequest?.fname} {friendrequest?.friendrequest?.lname} <button onClick={() => dispatch(rejectFriendRequestThunk(String(friendrequest?.friendrequest?._id)))}>reject</button><button onClick={() => dispatch(acceptFriendRequestThunk(String(friendrequest?.friendrequest?._id)))}>Accept</button>
            </span>
        </div>
    )
}

export default PendingFriend
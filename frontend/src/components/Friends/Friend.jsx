import { useDispatch } from "react-redux"
import { unfriendThunk } from "../../store/friends"

const Friend = (Friend) => {
    const dispatch = useDispatch()
    return(
        
        <div>
            <span>{Friend?.friend?.fname} {Friend?.friend?.lname} 
            <button onClick={() => dispatch(unfriendThunk(Friend?.friend?._id))}>UnFriend</button>
            </span>
            <p>{Friend.friend.username}</p>
        </div>
    )
}
export default Friend
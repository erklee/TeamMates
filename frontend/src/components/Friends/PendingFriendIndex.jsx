import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { getFriendRequestsThunk } from "../../store/friends"
import PendingFriend from "./Pendingfriend"

const PendingFriendIndex =() => {
    const friendrequests = useSelector(state => state.friends.friendRequests)
    const dispatch = useDispatch()
    console.log(friendrequests)
    
    useEffect(() => {
       dispatch(getFriendRequestsThunk())
    }, [dispatch]);

    return(
        <div>
            {friendrequests?.map((friendrequest, index) =>
                <PendingFriend key={`${friendrequest?._id}_${index}`} friendrequest={friendrequest}/>
            )}
        </div>
        
    )
}

export default PendingFriendIndex
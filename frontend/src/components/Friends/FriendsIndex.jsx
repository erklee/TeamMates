import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { getFriendsThunk } from "../../store/friends"
import Friend from "./Friend"

const FriendsIndex = () => {
    const friends = useSelector(state => state.friends.friends)
    const dispatch = useDispatch()
   
    console.log(friends)
    useEffect(() => {
        dispatch(getFriendsThunk())
    }, [dispatch]);
    return(
        <div>
            {friends?.map((friend, index) => 
                <Friend key={`${friend?._id}_${index}`} friend={friend}/>
            )}
        </div>
    )
}
export default FriendsIndex
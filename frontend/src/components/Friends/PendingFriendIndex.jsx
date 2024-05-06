import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getFriendRequestsThunk } from "../../store/friends";
import PendingFriend from "./PendingFriend";

const PendingFriendIndex =() => {
  const friendrequests = useSelector(state => state.friends.friendRequests);
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
    
  useEffect(() => {
    dispatch(getFriendRequestsThunk(user._id));
  }, [dispatch, user._id]);

  return(
    <div className="pendingFrameWrapper">
      {friendrequests?.map((friendrequest, index) =>
        <PendingFriend key={`${friendrequest?._id}_${index}`} friendrequest={friendrequest}/>
      )}
    </div>
        
  );
};

export default PendingFriendIndex;
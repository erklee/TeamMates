import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getFriendsThunk } from "../../store/friends";
import Friend from "./Friend";

const FriendsIndex = () => {
  const friends = useSelector(state => state.friends.friends);
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);

  useEffect(() => {
    dispatch(getFriendsThunk(user._id));
  }, [dispatch, user?._id]);
  return(
    <div className="friendsIndexWrapper">
      {friends?.map((friend, index) => 
        <Friend key={`${friend?._id}_${index}`} friend={friend}/>
      )}
    </div>
  );
};
export default FriendsIndex;
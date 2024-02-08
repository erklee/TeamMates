import { useEffect, useState } from "react";
import "./ProfilePage.css";
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../store/users";
import { fetchUserEvents } from "../../store/events";
import UserEventsIndex from "./UserEventsIndex";
import backgroundImg from "../../assets/images/footballField.jpeg"
import Footer from "../AboutUs/Footer";
import { getFriendRequestsThunk, getFriendsThunk, sendFriendRequestThunk, unfriendThunk } from "../../store/friends";

function ProfilePage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const user = useSelector(state => state.users.user);
  const userEvents = useSelector(state => state.events.user);
  const currentUser = useSelector(state => state.session.user);
  const [loading, setLoading] = useState(false);
  const [friendStatus, setFriendStatus] = useState(null); 

  useEffect(() => {
    setLoading(true);
    dispatch(getFriendRequestsThunk(currentUser._id))
      .then(() => dispatch(getFriendRequestsThunk(id)))
      .then(() => dispatch(getFriendsThunk(currentUser._id)))
      .then(() => setLoading(false));
  }, [dispatch, currentUser._id, id]);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchUser(id))
      .then(() => dispatch(fetchUserEvents(id)))
      .then(() => setLoading(false));
  }, [dispatch, id]);

  useEffect(() => {
    if (currentUser?.friendIds?.includes(id)) {
      setFriendStatus(true); 
    } else if (user?.requestIds?.includes(currentUser?._id)) {
      setFriendStatus(false); 
    } else {
      setFriendStatus(null);
    }
  }, [currentUser, user, id]);

  const handleUnfriend = async () => {
    setLoading(true);
    await dispatch(unfriendThunk(String(id)));
    setFriendStatus(null); 
    setLoading(false);
  };

  const handleSendFriendRequest = async () => {
    setLoading(true);
    await dispatch(sendFriendRequestThunk(String(id)));
    setFriendStatus(false); 
    setLoading(false);
  };

  const renderActionButton = () => {
    if (!currentUser || !currentUser.friendIds || !id) {
      return null;
    }
  
    if (friendStatus === true) {
      return <button onClick={handleUnfriend}>Unfriend</button>
    } else if (friendStatus === false) {
      return <h1>...Pending</h1>;
    } else {
      return <button onClick={handleSendFriendRequest}>Friend</button>;
    }
  }

  if (loading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  } else if (!user) {
    return (
      <div>
        <h1>Waiting...</h1>
      </div>
    );
  } else {
    return (
      <div className="profilePageWrapper">
        <div className="profilePageContainer">
          <img src={backgroundImg} alt="background" className="backgoundImg"/>
          <img className="profilePic" src={user.profileImageUrl} alt="Profile" />
          <h1 className="firstLastName">{user.fname + " " + user.lname}</h1>
          <h1>{renderActionButton()}</h1>
      
          <div className="profileInfoWrapper">
            <UserEventsIndex userEvents={userEvents}/>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default ProfilePage;



import { useEffect } from "react";
import "./ProfilePage.css";
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../store/users";
import { fetchUserEvents } from "../../store/events";
import UserEventsIndex from "./UserEventsIndex";
import backgroundImg from "../../assets/images/footballField.jpeg"
import Footer from "../AboutUs/Footer";
import { getFriendsThunk } from "../../store/friends";





function ProfilePage() {
//   const navigate = useNavigate();
  const dispatch = useDispatch();
  const {id} = useParams();
  const {user} = useSelector(state => state.users)
  const userEvents = useSelector(state => state.events.user)
  const friends = useSelector(state => state.friends.friends)
  console.log(user)
  console.log(friends)
    
  useEffect(() =>{
    dispatch(fetchUser(id));
    dispatch(fetchUserEvents(id))
    dispatch(getFriendsThunk())
  }, [dispatch, id]);

  useEffect(() => {
    const storedFriends = localStorage.getItem('friends');
    if (storedFriends) {
      dispatch({ type: 'GET_FRIENDS', payload: JSON.parse(storedFriends) });
    }
  }, [dispatch]);

  // When friends data changes, update local storage
  useEffect(() => {
    localStorage.setItem('friends', JSON.stringify(friends));
  }, [friends]);

  // const renderActionButton = () => {
  //   const showPending = requestStatus === 'pending' || isRequestSent;
  //   if (isFriend) {
  //     return <button onClick={handleUnfriend}>Unfriend</button>;
  //   } else if (isRequestReceived) {
  //     return <button onClick={handleAcceptFriendRequest}>Accept</button>;
  //   } else if (showPending) {
  //     return <span>Pending</span>;
  //   } else {
  //     return <button onClick={handleSendFriendRequest}>Send Friend Request</button>;
  //   }
  // };

  if (!user) {
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
          <h1 className="firstLastName" >{user.fname + " " + user.lname}</h1>
          <div className="profileInfoWrapper">
            <UserEventsIndex userEvents={userEvents}/>
          </div>
        </div>
        <Footer />
      </div>
      

    )
  }


}


export default ProfilePage;
import { useEffect } from "react";
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
//   const navigate = useNavigate();
  const dispatch = useDispatch();
  const {id} = useParams();
  const user = useSelector(state => state.users.user)
  const userEvents = useSelector(state => state.events.user)
  const currentUser = useSelector(state => state.session.user)
   
 
  useEffect(() =>{
    dispatch(getFriendRequestsThunk())
    dispatch(getFriendsThunk())
    dispatch(fetchUser(id));
    dispatch(fetchUserEvents(id))
  }, [dispatch, id]);



  const renderActionButton = () => {
    if (!currentUser || !currentUser?.friendIds || !id) {
      return null; // Handle cases where currentUser or id is not defined
    }
  
    if (currentUser?.friendIds.includes(id)) {
      
      return <button onClick={() => dispatch(unfriendThunk(String(id)))}>Unfriend</button>;
    } else if(user?.requestIds?.includes(currentUser?._id)){
      return <h1>...Pending</h1>
    }
    else {
      return <button onClick={() => {
        dispatch(sendFriendRequestThunk(String(id)));
      }}>Friend</button>;
    }
  }


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
          <h1>{renderActionButton()}</h1>
      
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
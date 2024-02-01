import { useEffect } from "react";
import "./ProfilePage.css";
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../store/users";
import { fetchUserEvents } from "../../store/events";
import backgroundImg from "../../assets/images/footballField.jpeg"




function ProfilePage() {
//   const navigate = useNavigate();
  const dispatch = useDispatch();
  const {id} = useParams();
  const {user} = useSelector(state => state.users)
  
  console.log(user)
    
  useEffect(() =>{
    dispatch(fetchUser(id));
    dispatch(fetchUserEvents(id))
  }, [dispatch, id]);

  if (!user) {
    return (
      <div>
        <h1>Waiting...</h1>
      </div>
    );
  } else {
    return (
      <div className="profilePageContainer">
        <img src={backgroundImg} alt="background" className="backgoundImg"/>
        <img className="profilePic" src={user.profileImageUrl} alt="Profile" />
        <h1 className="firstLastName" >{user.fname + " " + user.lname}</h1>
        <div className="profileInfoWrapper">
          
        </div>
      </div>
      

    )
  }


}


export default ProfilePage;
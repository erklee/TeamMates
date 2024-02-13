import "./ProfileDropdown.css"
import {useDispatch} from 'react-redux'
import { logout  } from "../../store/session";
import {useNavigate} from "react-router-dom"
import { hideModal} from '../../store/modals';



export default function ProfileDropdown({className, setVisible, currentUser}){
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleEvents = (e) =>  {
    e.preventDefault();
    setVisible(false)
    navigate('events');
  }
  const handleFriends = (e) =>  {
    e.preventDefault();
    setVisible(false)
    navigate('friends');
  }
  const logoutUser = e => {
    e.preventDefault();
    setVisible(false)
    dispatch(logout());
    dispatch(hideModal());
    navigate("/")
  };

  const handleUserProfile = (e) => {
    e.preventDefault();
    setVisible(false)
    navigate(`/profile/${currentUser["_id"]}`);
  };
  return (
    <div className={className}>
      <button className="firstButton" onClick={handleUserProfile}>Profile</button>
      <button className="secondButton"onClick={handleEvents}>Events</button>
      <button className="secondButton"onClick={handleFriends}>Friends</button>
      <button className="thirdButton"onClick={logoutUser}>Logout</button>
    </div>
  )


}
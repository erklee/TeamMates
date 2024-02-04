import "./ProfileDropdown.css"
import {useDispatch} from 'react-redux'
import { logout  } from "../../store/session";
import {useNavigate} from "react-router-dom"
import { hideModal} from '../../store/modals';



export default function ProfileDropdown({className, setVisible, currentUser}){
  const navigate = useNavigate()
  const dispatch = useDispatch()
  console.log(currentUser)
  const handleEvents = (e) =>  {
    e.preventDefault();
    setVisible(false)
    navigate('events');
  }
  const logoutUser = e => {
    e.preventDefault();
    setVisible(false)
    dispatch(logout());
    dispatch(hideModal());
  };

  const handleUserProfile = (e) => {
    e.preventDefault();
    setVisible(false)
    navigate(`/profile/${currentUser["_id"]}`);
  };
  return (
    <div className={className}>
      <button onClick={handleUserProfile}>Profile</button>
      <button onClick={handleEvents}>Events</button>
      <button onClick={logoutUser}>Logout</button>
    </div>
  )


}
import "./ProfileDropdown.css"
import {useDispatch} from 'react-redux'
import { logout  } from "../../store/session";
import {useNavigate} from "react-router-dom"


export default function ProfileDropdown({className, setVisible}){
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleEvents = (e) =>  {
    e.preventDefault();
    navigate('events');
  }
  const logoutUser = e => {
    e.preventDefault();
    setVisible(false)
    dispatch(logout());
  };
  return (
    <div className={className}>
      <button>Profile</button>
      <button onClick={handleEvents}>Events</button>
      <button onClick={logoutUser}>Logout</button>
    </div>
  )


}
import "./ProfileDropdown.css"
import {useDispatch} from 'react-redux'
import { logout  } from "../../store/session";


export default function ProfileDropdown({className}){
  const dispatch = useDispatch()

  const logoutUser = e => {
    e.preventDefault();
    dispatch(logout());
  };
  return (
    <div className={className}>
      <button>Profile</button>
      <button>Events</button>
      <button onClick={logoutUser}>Logout</button>
    </div>
  )


}

import { useSelector, useDispatch } from 'react-redux';
import { useState  } from 'react';
import './NavBar.css';

import { showModal } from '../../store/modals';
import jerseyIcon from '../../assets/icons/jerseyIcon.png'
import ProfileDropdown from './profileDropdown';


function NavBar () {
  const [visible, setVisible] = useState(true);
  const currentUser = useSelector(state => state.session.user)
  const loggedIn = useSelector(state => !!state.session.user);
  const dispatch = useDispatch();
  console.log(currentUser)
  

  const handleProfileDropdown = e => {
    e.preventDefault()
    setVisible(!visible)
  }

  const handleShowModal = e => {
    e.preventDefault()
    if(e.target.id === 'navBarLogin'){
      dispatch(showModal('LoginModal'))
    } 
    if(e.target.id === 'navBarSignUp'){
      dispatch(showModal('SignUpModal'))
    } 
  }



  const getLinks = () => {
    if (loggedIn) {
      return (
        <div className="links-nav">

          <div className='userIconContainer' onClick={handleProfileDropdown}>
            <img src={jerseyIcon}  height='30' width='30' alt="profile icon" />
            <p>{currentUser.fname}</p>
          </div>
          {visible && <ProfileDropdown className="profileDropdownWrapper" />}

        </div>
          
      );
    } else {
      return (
        <div className="links-auth">
          <button id="navBarSignUp" onClick={handleShowModal} to={'/signup'}>Sign Up</button>
          <button onClick={handleShowModal} id="navBarLogin"to={'/login'}>Login</button>
        </div>
      );
    }
  };

  return (
    <div className='navBarContainer'>
      <h1>TeamMates</h1>
      { getLinks() }
    </div>
  );
}

export default NavBar;
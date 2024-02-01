
import { useSelector, useDispatch } from 'react-redux';
import { useState  } from 'react';
import './NavBar.css';

import { showModal } from '../../store/modals';
import jerseyIcon from '../../assets/icons/jerseyIcon.png';
import ProfileDropdown from './ProfileDropdown';
import {useNavigate} from 'react-router-dom'


function NavBar() {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false);
  const currentUser = useSelector(state => state.session.user);
  const loggedIn = useSelector(state => !!state.session.user);
  const dispatch = useDispatch();


  const handleMainPage = e => {
    e.preventDefault()
    navigate("/")
  }

  const handleProfileDropdown = e => {
    e.preventDefault();
    setVisible(!visible);
    console.log('clicked');
  };

  const handleShowModal = e => {
    e.preventDefault();
    if(e.target.id === 'navBarLogin'){
      dispatch(showModal('LoginModal'));
    } 
    if(e.target.id === 'navBarSignUp'){
      dispatch(showModal('SignUpModal'));
    } 
  };



  const getLinks = () => {
    if (loggedIn) {
      return (
        <div className="links-nav">

          <div className='userIconContainer' onClick={handleProfileDropdown}>
            <img src={currentUser.profileImageUrl}  height='25' width='25' alt="profile icon" />
            <p>{currentUser.fname}</p>
          </div>
          {visible && <ProfileDropdown className="profileDropdownWrapper" visible={visible} setVisible={setVisible}/>}

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
      <h1 onClick={handleMainPage}>Team<span>Mates</span></h1>
      { getLinks() }
    </div>
  );
}

export default NavBar;

import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { useState  } from 'react';
import './NavBar.css';
import { useEffect } from 'react';
import { showModal } from '../../store/modals';


import ProfileDropdown from './ProfileDropdown';
import {useNavigate} from 'react-router-dom';
import { getCurrentUser } from '../../store/session';



function NavBar() {
  const location = useLocation();

  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const currentUser = useSelector(state => state.session.user);
  const loggedIn = useSelector(state => !!state.session.user);
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);


  const handleMainPage = e => {
    e.preventDefault();
    navigate("/");
  };

  const handleProfileDropdown = e => {
    e.preventDefault();
    setVisible(!visible);
    // console.log('clicked');
  };

  const handleShowModal = e => {
    e.preventDefault();
    if(e.target.id === 'navBarLogin'){
      dispatch(showModal('LoginModal'));
    } 
    if(e.target.id === 'navBarSignUp'){
      dispatch(showModal('SignUpModal'));
    } 

    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  const handleCreateEvent = () => {
    if (loggedIn){
      navigate("/events/new");
    } else {
      dispatch(showModal('SignUpModal'));
    }
  };





  const getLinks = () => {

    const createEventButton = (
      <button onClick={handleCreateEvent} id='create-button'><span>+</span> Event</button>
    );
  
    if (loggedIn) {
      return (
        <div className="links-nav">
          {createEventButton}
          <div className='userIconContainer' onClick={handleProfileDropdown}>
          {/* <button onClick={handleCreateEvent} id='create-button'>Create Event</button> //this shows only for when the user is logged in  */}
            <img src={currentUser?.profileImageUrl}  height='25' width='25' alt="profile icon" />
            <p>{currentUser.fname}</p>
          </div>
          {visible && <ProfileDropdown className="profileDropdownWrapper" currentUser={currentUser} visible={visible} setVisible={setVisible}/>}

        </div>
          
      );
    } else {
      return (
        <div className="links-auth">
          {currentUser && createEventButton} 
          <button id="navBarSignUp" onClick={handleShowModal} >Sign Up</button>
          <button onClick={handleShowModal} id="navBarLogin" >Login</button>
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
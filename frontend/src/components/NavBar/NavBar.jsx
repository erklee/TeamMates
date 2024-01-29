import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './NavBar.css';
import { logout } from '../../store/session';
import { showModal } from '../../store/modals';

function NavBar () {
  const loggedIn = useSelector(state => !!state.session.user);
  const dispatch = useDispatch();
  
  const logoutUser = e => {
      e.preventDefault();
      dispatch(logout());
  };

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
          <button onClick={logoutUser}>Logout</button>
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
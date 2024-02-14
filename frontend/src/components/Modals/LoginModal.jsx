import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {login, clearSessionErrors } from '../../store/session';
// import { hideModal, showModal } from '../../store/modals';
import { hideModal} from '../../store/modals';
import closeIcon from "../../assets/icons/closeIcon2.png";
import lockIcon from "../../assets/icons/lockIconWhite.png";
import emailIcon from "../../assets/icons/emailIconWhite.png";
import { getCurrentUser } from '../../store/session';
import "./LoginModal.css";
import {useNavigate} from 'react-router-dom';



export default function LoginModal() {
  const navigate = useNavigate();
  const modalVisible = useSelector(state => state.modals["LoginModal"]);
  // console.log('showModal:', showModal);
  const currentUser = useSelector(state => state.session.user);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const errors = useSelector(state => state.errors.session);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      
      dispatch(getCurrentUser());
      dispatch(clearSessionErrors());
    };
  }, [dispatch]);

  const update = (field) => {
    const setState = field === 'email' ? setEmail : setPassword;
    return e => setState(e.currentTarget.value);
  };

  const handleHideModal = (e) => {
    e.preventDefault();
    dispatch(hideModal());
    dispatch(clearSessionErrors());
    setEmail('');
    setPassword('');
  };



  // const handleSubmit =  async (e) => {
  //   e.preventDefault();

  //   try {
  //     if  (dispatch(login({ email, password })));
  //      dispatch(hideModal());
  //   } catch (error) {
  //     dispatch(showModal('LoginModal'));
  //     // Handle error if the login dispatch fails
  //     console.error("Login failed:", error);
  //     // You might want to show an error message or perform other actions here
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(login({ email, password })); 
    
    if (!res.errors) {
      navigate('/events')
      setEmail('');
      setPassword('');
    }

  }


  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   dispatch(login({ email, password }))
  //     .then(() => {
  //       dispatch(hideModal());
  //     })
  //     .catch((error) => {
  //       dispatch(showModal('LoginModal'));
  //       console.error("Login failed:", error);
  //       // Handle error if the login dispatch fails
  //       // You might want to show an error message or perform other actions here
  //     });
  // };




  const handleDemo = (e) => {
    e.preventDefault();
    setEmail('');
    setPassword('');
  
    dispatch(login({email: 'demo@aa.io', password: 'password' })); 
    navigate('/events')
  };

  return (
    (modalVisible && !currentUser) &&
    <div className="modal-overlay">
      <form className="loginModal" action="submit" onSubmit={handleSubmit}>
        <h1 className="loginModalTitle">Login</h1>
        { errors?.email && <li className="errors">{errors?.email}</li>}
        <label>
          {/* <p>Email</p> */}
          <input type="text"
            value={email}
            onChange={update('email')}
            placeholder='Email'
          />
          <img src={emailIcon} className="loginFormIcons" alt="closeIcon" />
        </label> 
        { errors?.password && <li className="errors">{errors?.password}</li> }
        <label>
          {/* <p>Password</p> */}
          <input type="password"
            value={password}
            onChange={update('password')}
            placeholder='Password'

          />
          <img src={lockIcon} className="loginFormIcons" alt="closeIcon" />
        </label>
        <div className='loginButtonsWrapper'>
          <input
            className='loginModalSubmit'
            type="submit"
            value="Log In"
            disabled={!email || !password}
          />
          
          <button className='loginModalSubmit' onClick={handleDemo}>Demo</button>
        </div>

        
        <img src={closeIcon} onClick={handleHideModal} className="closeLoginImg" alt="closeIcon" />
        {/* <button className='closeLoginModal' onClick={handleHideModal}>close</button> */}
      </form>
    </div>
  );
  
}
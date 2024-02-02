import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {login, clearSessionErrors } from '../../store/session';
import { hideModal } from '../../store/modals';
import closeIcon from "../../assets/icons/closeIcon2.png";
import "./LoginModal.css";



export default function LoginModal() {
  const showModal = useSelector(state => state.modals["LoginModal"]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const errors = useSelector(state => state.errors.session);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(clearSessionErrors());
    };
  }, [dispatch]);

  const update = (field) => {
    const setState = field === 'email' ? setEmail : setPassword;
    return e => setState(e.currentTarget.value);
  };

  const handleHideModal = (e) => {
    e.preventDefault();
    dispatch(hideModal("LoginModal"));
    dispatch(clearSessionErrors());
    setEmail('');
    setPassword('');
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const result = await dispatch(login({ email, password }));
    
  //   if (result && result.success) {
  //     console.log("Before hiding modal");
  //     setEmail('');
  //     setPassword('');
      
  //     dispatch(hideModal("LoginModal"));
  //     console.log("After hiding modal");
  //   } else{
  //     console.log('didnt work')
  //   }
  // };

  const handleSubmit = (e) => {
  e.preventDefault();

  dispatch(login({ email, password }))
    .then((result) => {
      if (result && result.success) {
        // console.log("Before hiding modal");
        setEmail('');
        setPassword('');
        
        dispatch(hideModal("LoginModal"));
        // console.log("After hiding modal");
      } else {
        // console.log('didnt work');
      }
    })
    .catch((error) => {
      console.error('An error occurred:', error);
    });
};

  const handleDemo = (e) => {
    e.preventDefault();
    setPassword('password');
    setEmail('shaun@aa.io');
  };

  return (
    showModal &&
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
        </label> 
        { errors?.password && <li className="errors">{errors?.password}</li> }
        <label>
          {/* <p>Password</p> */}
          <input type="password"
            value={password}
            onChange={update('password')}
            placeholder='Password'

          />
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
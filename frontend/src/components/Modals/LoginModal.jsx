import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import {login, clearSessionErrors } from '../../store/session';
import { hideModal } from '../../store/modals';
import closeIcon from "../../assets/icons/closeIcon.png"
import "./LoginModal.css"



export default function LoginModal() {
  const navigate = useNavigate();
  const showModal = useSelector(state => state.modals["LoginModal"])
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
  }

  const handleHideModal = (e) => {
    e.preventDefault()
    dispatch(hideModal("LoginModal"))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
 
    const result = await dispatch(login({ email, password }));

    if (result && result.success) {
    // Close the modal on successful login
      navigate("/")
      dispatch(hideModal("LoginModal"));
    } 
    // return dispatch(login({ email, password })); 
  }

  const handleDemo = (e) => {
    e.preventDefault();
    setPassword('password')
    setEmail('shaun@aa.io')
  }

  return (
    showModal &&
    <div className="modal-overlay">
      <form className="loginModal" action="submit" onSubmit={handleSubmit}>
        <h1 className="loginModalTitle">Login</h1>
        <div className="errors">{errors?.email}</div>
        <label>
          <p>Email</p>
          <input type="text"
            value={email}
            onChange={update('email')}
            placeholder="Email"
          />
        </label>
        <div className="errors">{errors?.password}</div>
        <label>
          <p>Password</p>
          <input type="password"
            value={password}
            onChange={update('password')}
            placeholder="Password"
          />
        </label>
        <input
          className='loginModalSubmit'
          type="submit"
          value="Log In"
          disabled={!email || !password}
        />
        <button className='loginModalSubmit' onClick={handleDemo}>Demo</button>
        <img src={closeIcon} onClick={handleHideModal} className="closeLoginImg" alt="closeIcon" />
        {/* <button className='closeLoginModal' onClick={handleHideModal}>close</button> */}
      </form>
    </div>
  )
  
}
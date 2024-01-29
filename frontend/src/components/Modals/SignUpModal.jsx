import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {signup, clearSessionErrors } from '../../store/session';
import { hideModal } from '../../store/modals';
import "./SignUpModal.css";



export default function SignUpModal() {
  const showModal = useSelector(state => state.modals["SignUpModal"]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [birthdate, setBirthDate] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipcode, setZipcode] = useState('');
  const errors = useSelector(state => state.errors.session);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(clearSessionErrors());
    };
  }, [dispatch]);



  const handleHideModal = (e) => {
    e.preventDefault();
    dispatch(hideModal("SignUpModal"));
  };

  const handleSubmit = (e) => {
    const user = {
      email,
      username,
      password,
      birthdate,
      address: {
        street,
        city,
        state, 
        zipcode,
      },
    };
    e.preventDefault();
    dispatch(signup(user)); 
    setEmail('');
    setUsername('');
    setPassword('');
    setStreet('');
    setCity('');
    setState('');
    setZipcode('');

  };

  return (
    showModal &&
    <div className="modal-overlay">
      <form className="signUpModal" action="submit" onSubmit={handleSubmit}>
        <h1 className="signUpModalTitle">Sign Up</h1>
        <div className="errors">{errors?.email}</div>
        <p>An asterisk (*) indicates a required field</p>
        <div className="errors">{errors?.username}</div>
        <label>
          <p>Username*</p>
          <input type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
        </label>
        <div className="errors">{errors?.email}</div>
        <label>
          <p>Email*</p>
          <input type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
        </label>
        <div className="errors">{errors?.password}</div>
        <label>
          <p>Password*</p>
          <input type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </label>
        <div className="errors">{errors?.birthdate}</div>
        <label>
          <p>Birthdate*</p>
          <input type="date"
            value={birthdate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
        </label>

        <div className="errors">{errors?.street}</div>
        <label>
          <p>Street</p>
          <input type="string"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />
        </label>

        <div className="errors">{errors?.city}</div>
        <label>
          <p>City</p>
          <input type="string"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </label>

        <div className="errors">{errors?.state}</div>
        <label>
          <p>State</p>
          <input type="string"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
        </label>
        
        <div className="errors">{errors?.zipcode}</div>
        <label>
          <p>Zip Code</p>
          <input type="number"
            value={zipcode}
            onChange={(e) => setZipcode(e.target.value)}
          />
        </label>
   
        <input
          className='signUpModalSubmit'
          type="submit"
          value="Sign Up"
          disabled={!email || !username || !password || !birthdate}
        />


        <button className='closeSignUpModal' onClick={handleHideModal}>close</button>
      </form>
    </div>
  );
  
}
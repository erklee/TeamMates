import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {signup, login, clearSessionErrors } from '../../store/session';
import { useNavigate } from 'react-router-dom';
import { hideModal } from '../../store/modals';
import closeIcon from "../../assets/icons/closeIcon2.png";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import "./SignUpModal.css";



export default function SignUpModal() {
  const modalVisible = useSelector(state => state.modals["SignUpModal"]);
  const currentUser = useSelector(state => state.session.user);
  const navigate = useNavigate()

  const [email, setEmail] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
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


  const handleDemo = async (e) => {
    e.preventDefault();
    setEmail('');
    setPassword('');
  
    await dispatch(login({email: 'demo@aa.io', password: 'password' })); 
    navigate('/events')
  };

  const handleHideModal = (e) => {
    e.preventDefault();
    dispatch(hideModal("SignUpModal"));
    dispatch(clearSessionErrors());
  };

  const handleSubmit = async (e) => {
    const user = {
      email,
      username,
      password,
      birthdate,
      fname,
      lname,
      address: {
        street,
        city,
        state, 
        zipcode,
      },
    };
    e.preventDefault();
    const result = await dispatch(signup(user)); 

    if (result && result.success) {
    // Close the modal on successful login
      dispatch(hideModal("SignUpModal"));
      setEmail('');
      setUsername('');
      setPassword('');
      setStreet('');
      setCity('');
      setState('');
      setZipcode('');
      setFname(''),
      setLname('');
    } 
  
  };

  return (
    (modalVisible && !currentUser) &&
    <div className="modal-overlay">
      <form className="signUpModal" action="submit" onSubmit={handleSubmit}>
        <h1 className="signUpModalTitle">Sign Up</h1>
        <p className='asterickRequired'>An asterisk (*) indicates a required field</p>
        { errors?.fname && <li className="errors">{errors?.fname}</li>}
        { errors?.lname && <li className="errors">{errors?.lname}</li> }
        { errors?.username && <li className="errors">{errors?.username}</li> }
        { errors?.email && <li className="errors">{errors?.email}</li> }
        { errors?.password && <li className="errors">{errors?.password}</li> }
        { errors?.birthdate && <li className="errors">{errors?.birthdate}</li> }
        { errors?.street && <li className="errors">{errors?.street}</li> }
        { errors?.city && <li className="errors">{errors?.city}</li> }
        { errors?.state && <li className="errors">{errors?.state}</li> }
        { errors?.zipcode && <li className="errors">{errors?.zipcode}</li> }

        <div className='nameInput'>
          <label className='firstNameInput'>

            <input type="text"
              value={fname}
              onChange={(e) => setFname(e.target.value)}
              placeholder="First Name*"

            />
          </label>
          <label className='lastNameInput'>
            <input type="text"
              value={lname}
              onChange={(e) => setLname(e.target.value)}
              placeholder="Last name*"
            />
          </label>
        </div>
        <div className='usernameEmailInput'>
          <label className='usernameInput'>
            <input type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username*"
            />
          </label>

          <label>

            <input type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email*"
            />
          </label>

        </div>
        
        <div className='nameInput'>
          <label className='passwordInput'>
            <input type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password*"
            />
          </label>
          <label className='birthdateInput'>
            {/* <input type="date"
              value={birthdate}
              onChange={(e) => setBirthDate(e.target.value)}
            /> */}
            <DatePicker
              selected={birthdate}
              onChange={(date) => setBirthDate(date)}
              placeholderText="Birthdate* MM/DD/YYYY"
              dateFormat="MM/dd/yyyy"  // Customize date format if needed
              // Add any other customization props here
            />
          </label>
        </div>


        <label className='streetInput'>
          <input type="string"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            placeholder='Street'
          />
        </label>

        <div className='cityInfo'>
          <label className='cityInput'>
            <input type="string"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder='City'
            />
          </label>


          <label className='stateInput'>

            <input type="string"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder='State'
            />
          </label>
          

          <label className='zipCodeInput'>

            <input type="text"
              value={zipcode}
              onChange={(e) => setZipcode(e.target.value)}
              placeholder='Zip Code'
            />
          </label>
        </div>
        <button 
          className='signUpModalSubmit'
          disabled={!email || !username || !password || !birthdate || !fname || !lname}
        >
          Sign Up
        </button>
        <button className='signUpSubmit' onClick={handleDemo}>Demo</button>
        
        <img src={closeIcon} onClick={handleHideModal} className="closeSignUpImg" alt="closeIcon" />

        {/* <button className='closeSignUpModal' onClick={handleHideModal}>close</button> */}
      </form>
    </div>
  );
  
}
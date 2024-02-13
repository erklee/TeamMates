import { useState } from "react";
// import { useParams } from "react-router-dom";
// import jwtFetch from "../../store/jwt";
import { useDispatch, useSelector } from "react-redux";
import { composeEvent } from "../../store/events";
import { useNavigate } from "react-router-dom";
import "./EventCreateForm.css";
import eventFormPic from '../../assets/images/sports/allSports2.jpeg';
import Footer from "../AboutUs/Footer";

const SPORTS = [
  "basketball",
  "football",
  "baseball",
  "tennis",
  "soccer",
  "hockey",
];

const DIFFICULTIES = [  
  "easy",
  "medium",
  "hard",
];



export default function EventCreateForm() {

  const navigate = useNavigate();
  // const event = useSelector(state => state.events.new)
  const currentUser = useSelector(state => state.session.user);
  const errors = useSelector(state => state.errors.event);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [category, setCategory] = useState(SPORTS[0]);
  const [attendeesMax, setAttendeesMax] = useState(10);
  const [address1, setAddress1] = useState('');
  // const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('NY');
  const [zipcode, setZipcode] = useState('');
  const [time, setTime] = useState('');
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[0]);
  const [, setPictureUrl] = useState('');
  const basketballUrl = 'https://mern-teammates-seeds.s3.amazonaws.com/public/basketball.jpeg';
  const footballUrl = 'https://mern-teammates-seeds.s3.amazonaws.com/public/football.jpeg';
  const hockeyUrl =  'https://mern-teammates-seeds.s3.amazonaws.com/public/hockey.jpeg';
  const soccerlUrl = 'https://mern-teammates-seeds.s3.amazonaws.com/public/soccer.jpeg';
  const tennisUrl = 'https://mern-teammates-seeds.s3.amazonaws.com/public/tennis.jpeg';
  const baseballUrl = 'https://mern-teammates-seeds.s3.amazonaws.com/public/baseball.jpeg';
 
  const dispatch = useDispatch();

  const handleSubmit = async e => {
    e.preventDefault();

    // Set pictureUrl based on the selected category
    let categoryPictureUrl;
    switch (category) {
    case "basketball":
      categoryPictureUrl = basketballUrl;
      break;
    case "baseball":
      categoryPictureUrl = baseballUrl;
      break;
    case "football":
      categoryPictureUrl = footballUrl;
      break;
    case "tennis":
      categoryPictureUrl = tennisUrl;
      break;
    case "soccer":
      categoryPictureUrl = soccerlUrl;
      break;
    case "hockey":
      categoryPictureUrl = hockeyUrl;
      break;
    default:
      categoryPictureUrl = '';
    }

    console.log({
      title,
      description,
      date: eventDate,
      attendeesMax,
      difficulty,
      category,
      location: {
        address: `${address1}, ${city}, ${state}`,
        zipcode,
      },
      pictureUrl: categoryPictureUrl, // Use the category-specific pictureUrl
    })

    // Set the state values and pictureUrl
    await setTitle("");
    await setDescription("");
    await setEventDate("");
    await setCategory("");
    await setAttendeesMax("10");
    await setAddress1("");
    // await setAddress2("");
    await setCity("");
    await setState("NY");
    await setZipcode("");
    await setTime(""),
    await setDifficulty("easy");
    await setPictureUrl(categoryPictureUrl);

    // Dispatch the composeEvent action

    // const eventDateTime = new Date()
    // eventDateTime.setDate(eventDate)
    // eventDateTime.setTime(eventDate)

    
    const res = await dispatch(composeEvent({
      title,
      description,
      date: `${eventDate}T${time}`,
      attendeesMax,
      difficulty,
      category,
      location: {
        address: `${address1}, ${city}, ${state}`,
        zipcode,
      },
      pictureUrl: categoryPictureUrl, // Use the category-specific pictureUrl
    }));

    if (!res.errors) {
      navigate(`/profile/${currentUser["_id"]}`)
    }
  };






  return (
    <div className="eventCreatePage">
      <div className="eventCreateFormWrapper">
        <img className="eventcreatFormPic" src={eventFormPic} alt="EventPic" />
        {/* 
        <div className="createEventTilte">
            Event Details
        </div> */}
        <form 
          htmlFor="event-create"
          onSubmit={handleSubmit}
          className="eventCreateForm"
        >
          {errors?.title && <p className="date errors">{errors?.title ? errors.title : ''}</p>}
          <label id="createFormTitle" htmlFor="title">
            <p>Title</p>
            <input 
              type="text"
              className="event-title input"
              value={title}
              onChange={e => {
                e.preventDefault();
                setTitle(e.target.value);
              }}
              
            />

          </label>
          <label htmlFor="description">
            <p>Description</p>
            <textarea 
              className="event-description input" 
              id="description-input" 
              cols="30" 
              rows="10"
              value={description}
              onChange={e => {
                e.preventDefault();
                setDescription(e.target.value);
              }}
            ></textarea>
          </label>
          {errors?.date && <p className="date errors">{errors?.date ? errors.date : ''}</p>}

          <label 
            htmlFor="date">
            <p>Date</p>
  
            <input 
              type="date" 
              className="event-date input"
              value={eventDate}
              onChange={e => {
                e.preventDefault();
                setEventDate(e.target.value);
              }}
              required

            />


          </label>
          <label 
            htmlFor="time">
            <p>Time</p>
  
            <input 
              type="time" 
              className="event-date input"
              value={time}
              onChange={e => {
                e.preventDefault();
                setTime(e.target.value);
              }}
              required

            />
            </label>
          <label htmlFor="category">
            <p>Category</p>
            <select 
              className="category input" 
              id="category-select" 
              value={category}
              onChange={e => {
                e.preventDefault();
                setCategory(e.target.value);
              }}>
              {
                SPORTS.map((sport, index) => <option key={`sport-${index}`} value={sport}>{sport[0].toUpperCase() + sport.slice(1)}</option>)
              }
            required
            </select>
          </label>
          <label htmlFor="difficulty">
            <p>Difficulty</p>
            <select
              defaultValue={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="editDifficulty"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </label>
          {errors?.attendeesMax && <p className="attendees errors">{errors.attendeesMax}</p>}
          <label htmlFor="max-attendees">
            <p>Max Attendees</p>
            <input 
              type="number" 
              className="event-max-attendees input"
              value={attendeesMax}
              onChange={e => {
                e.preventDefault();
                setAttendeesMax(e.target.value);
              }}
              required
            />
          </label>
          { errors?.location && <p className="address errors">{errors?.location ? errors.location : ''}</p> }

          <div id="address-input-wrapper">
            <label htmlFor="address-line-1">
              <p>Address</p>
              <input 
                type="text" 
                className="address-line" 
                value={address1}
                onChange={e => {
                  e.preventDefault();
                  setAddress1(e.target.value);
                }}
                required
              />
            </label>
            {/* <label htmlFor="address-line-2">
              <p>Address Line 2</p>
              <input 
                type="text" 
                className="address-line-2 input"
                value={address2}
                onChange={e => {
                  e.preventDefault();
                  setAddress2(e.target.value);
                }} />
            </label> */}
          </div>
          <div className="eventCreateCityStateZip">
            <label htmlFor="address-city">
              <p>City</p>
              <input 
                type="text" 
                className="address-city input"
                value={city}
                onChange={e => {
                  e.preventDefault();
                  setCity(e.target.value);
                }} />
            </label>
            <label htmlFor="address-state">
              <p>State</p>
              <select 
                className="address-state input" 
                id="address-state-select"
                value={state.length ? state : "AL"}
                onChange={e => {
                  e.preventDefault();
                  setState(e.target.value);
                }}>
                <option value="AL">Alabama</option>
                <option value="AK">Alaska</option>
                <option value="AZ">Arizona</option>
                <option value="AR">Arkansas</option>
                <option value="CA">California</option>
                <option value="CO">Colorado</option>
                <option value="CT">Connecticut</option>
                <option value="DE">Delaware</option>
                <option value="FL">Florida</option>
                <option value="GA">Georgia</option>
                <option value="HI">Hawaii</option>
                <option value="ID">Idaho</option>
                <option value="IL">Illinois</option>
                <option value="IN">Indiana</option>
                <option value="IA">Iowa</option>
                <option value="KS">Kansas</option>
                <option value="KY">Kentucky</option>
                <option value="LA">Louisiana</option>
                <option value="ME">Maine</option>
                <option value="MD">Maryland</option>
                <option value="MI">Michigan</option>
                <option value="MN">Minnesota</option>
                <option value="MS">Mississippi</option>
                <option value="MO">Missouri</option>
                <option value="MT">Montana</option>
                <option value="NE">Nebraska</option>
                <option value="NV">Nevada</option>
                <option value="NH">New Hampshire</option>
                <option value="NJ">New Jersey</option>
                <option value="NY">New York</option>
                <option value="NC">North Carolina</option>
                <option value="ND">North Dakota</option>
                <option value="OH">Ohio</option>
                <option value="OK">Oklahoma</option>
                <option value="OR">Oregon</option>
                <option value="PA">Pennsylvania</option>
                <option value="RI">Rhode Island</option>
                <option value="SC">South Carolina</option>
                <option value="SD">South Dakota</option>
                <option value="TN">Tennessee</option>
                <option value="TX">Texas</option>
                <option value="UT">Utah</option>
                <option value="VT">Vermont</option>
                <option value="VA">Virginia</option>
                <option value="WA">Washington</option>
                <option value="WV">West Virginia</option>
                <option value="WI">Wisconsin</option>
                <option value="WY">Wyoming</option>
              required
              </select>
            </label>

            <label htmlFor="zipcode">
              <p>Zipcode</p>
              <input 
                type="text"
                className="zipcode input"
                value={zipcode}
                onChange={e => {
                  e.preventDefault();
                  setZipcode(e.target.value);
                }} 
                required
              />
            </label>
            <br />

          </div>
          
          <button className="eventCreateButton"type="submit">Submit</button>
        </form>
      </div>
      <Footer />
    </div>
  );
}
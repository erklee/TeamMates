import { useEffect, useState } from "react";
import {  useDispatch } from "react-redux";
import { useLoaderData, useParams, useNavigate } from 'react-router-dom';
import { fetchEvent, updatedEvent } from "../../store/events";
import eventFormPic from '../../assets/images/sports/allSports2.jpeg';
import './EventEditForm.css';
import Footer from "../AboutUs/Footer";

const SPORTS = [
  "basketball",
  "football",
  "baseball",
  "tennis",
  "soccer",
  "hockey",
];

function Edit(){
  const { eventId } = useParams();  
  const dispatch= useDispatch();
  const navigate = useNavigate();
  
  const event = useLoaderData();
  useEffect(() => {
    dispatch(fetchEvent(eventId));
  }, [dispatch,eventId]);
    
  
  const [attendeesMax, setAttendeesMax] = useState(event?.attendeesMax);
  const [category, setCategory] = useState(event?.category);
  const [time,setTime] = useState(event?.date.split("T")[1].trim())
  const [eventDate, setEventDate] = useState(event?.date.split("T")[0]);
  
  
  const [description, setDescription] = useState(event?.description);
  const [difficulty, setDifficulty] = useState(event?.difficulty);
  const fullAddress = event?.location.address;
  const [address, setAddress] = useState(fullAddress.split(',')[0].trim());
  const [city, setCity] = useState(fullAddress.split(',')[1].trim());
  const [state, setState] = useState(fullAddress.split(',')[2].trim());
  

  const [zipcode, setZipcode] = useState(event?.location.zipcode);
  const [title,setTitle] = useState(event?.title);




  const handleSubmit = (e) => {
    e.preventDefault();
    const editedEvent = {
      _id: event?._id,

      title,
      description,
      date: `${eventDate}T${time}`,
      attendeesMax,
      difficulty,
      category,
      location: {
        address: `${address}, ${city}, ${state}`,
        zipcode,
      },
    };
    
    dispatch(updatedEvent(editedEvent))
      .then(() => {
        navigate(`/events/${event?._id}`);
      })
      .catch((error) => {
        console.error("Error updating event:", error);
      });
  };
  // return(
  //   <div className="editEventPage">
  //     <div className="eventCreateFormWrapper">
  //   <img className="eventcreatFormPic" src={eventFormPic} alt="EventPic" />

  //     <label > Title
  //       <input 
  //         className="editTitle"
  //         type="text" 
  //         value={title}
  //         onChange={(e) => setTitle(e.target.value)}
  //       />
  //     </label>
  //     <br />
  //     <select
  //       defaultValue={category}
  //       onChange={(e) => setCatrgory(e.target.value)}
  //       className="editCategory"
  //     >
  //       <option value="basketball">BasketBall</option>
  //       <option value="football">Football</option>
  //       <option value="baseball">Baseball</option>
  //       <option value="tennis">Tennis</option>
  //       <option value="soccer">Soccer</option>
  //       <option value="hockey">Hockey</option>
  //     </select>
  //     <br />
  //     <label > Attendees Max
  //       <input 
  //         className="editAttendeesMax"
  //         type="text" 
  //         defaultValue={attendeesMax}
  //         // placeholder="Value must be greater than 1"
  //         onChange={(e) => setAttendeesMax(e.target.value)}
  //       />
  //     </label>
  //     <br />
  //     <label > Date of Event
  //       <input 
  //         className="editAttendeesMax"
  //         type="date" 
  //         defaultValue={date}
  //         // placeholder="Value must be greater than 1"
  //         onChange={(e) => setDate(e.target.value)}
  //       />
  //     </label>
  //     <br />
  //     <label > Description 
  //       <input 
  //         className="editDescription"
  //         type="textarea" 
  //         maxLength="3000"
  //         defaultValue={description}
  //         // placeholder="Describe your event"
  //         onChange={(e) => setDescription(e.target.value)}
  //       />
  //     </label>
  //     <br />
  //     <select
  //       defaultValue={difficulty}
  //       onChange={(e) => setDifficulty(e.target.value)}
  //       className="editDifficulty"
  //     >
  //       <option value="easy">Easy</option>
  //       <option value="medium">Medium</option>
  //       <option value="hard">Hard</option>
  //     </select>
  //     <br />
  //     <label > Address
  //       <input 
  //         className="editAddress"
  //         type="text" 
  //         defaultValue={address}
            
  //         onChange={(e) => setAddress(e.target.value)}        
  //       />
  //     </label>
  //     <br />
  //     <label > Zipcode
  //       <input 
  //           className="editZipcode"
  //           type="text" 
  //           defaultValue={zipcode}
  //           onChange={(e) => setZipcode(e.target.value)}
  //       />
  //     </label>
  //     <button onClick={handleSubmit}>Submit</button>
  //   </div>
  // </div>
  // );
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
          <label id="createFormTitle" htmlFor="title">
            <p>Title</p>
            <input
              type="text"
              className="event-title input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
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
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </label>
          <label htmlFor="date">
            <p>Date</p>
            <input
              type="date"
              className="event-date input"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
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
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {SPORTS.map((sport, index) => (
                <option key={`sport-${index}`} value={sport}>
                  {sport[0].toUpperCase() + sport.slice(1)}
                </option>
              ))}
            </select>
          </label>
          <label htmlFor="difficulty">
            <p>Difficulty</p>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="editDifficulty"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </label>
          <label htmlFor="max-attendees">
            <p>Max Attendees</p>
            <input
              type="number"
              className="event-max-attendees input"
              value={attendeesMax}
              onChange={(e) => setAttendeesMax(e.target.value)}
              required
            />
          </label>

          <label htmlFor="address-line-1" className="eventEditAddress">
            <p>Address</p>
            <input
              type="text"
       
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </label>
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
                value={state}
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
              onChange={(e) => setZipcode(e.target.value)}
              required
            />
          </label>
          <br />
          </div>
          <button className="eventCreateButton" type="submit">
            Submit
          </button>
        </form>
      
      </div>
      <Footer />
    </div>
  );

}

export default Edit;
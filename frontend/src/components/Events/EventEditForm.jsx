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
  // const [eventDate, setEventDate] = useState(event?.date);
  const [eventDate, setEventDate] = useState(() => {
    const parsedDate = new Date(event?.date);
    const year = parsedDate.getFullYear();
    const month = parsedDate.getMonth() + 1; // Months are zero-based, so add 1
    const date = parsedDate.getDate();
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
    return formattedDate;
  });
  const [description, setDescription] = useState(event?.description);
  const [difficulty, setDifficulty] = useState(event?.difficulty);
  const [address, setAddress] = useState(event?.location.address);
  const [zipcode, setZipcode] = useState(event?.location.zipcode);
  const [title,setTitle] = useState(event?.title);




  const handleSubmit = (e) => {
    e.preventDefault();
    const editedEvent = {
      _id: event?._id,

      title,
      description,
      date: eventDate,
      attendeesMax,
      difficulty,
      category,
      location: {
        address,
        zipcode,
      },
    };
    // dispatch(updatedEvent(editedEvent));
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
            <p>Address Line 1</p>
            <input
              type="text"
       
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
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
import { useEffect, useState } from "react";
import {  useDispatch } from "react-redux";
import { useLoaderData, useParams } from 'react-router-dom';
import { fetchEvent, updatedEvent } from "../../store/events";
import './EventEditForm.css'

function Edit(){
  const { eventId } = useParams();  
  const dispatch= useDispatch();
   
  const event = useLoaderData();
  useEffect(() => {
    dispatch(fetchEvent(eventId));
  }, [dispatch,eventId]);
    
  console.log(eventId);
  const [attendeesMax, setAttendeesMax] = useState(event?.attendeesMax);
  const [category, setCatrgory] = useState(event?.category);
  const[date, setDate] = useState(event?.date);
  const [description, setDescription] = useState(event?.description);
  const [difficulty, setDifficulty] = useState(event?.difficulty);
  const [address, setAddress] = useState(event?.location.address);
  const [zipcode, setZipcode] = useState(event?.location.zipcode);
  const [title,setTitle] = useState(event?.title);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updateEvent = {
      _id: event?._id,
      attendess: event?.attendess,
      attendeesMax: attendeesMax,
      category: category,
      date: date,
      description: description,
      difficulty: difficulty,
      location:{
        address: address,
        zipcode: zipcode,
      },
      title: title,
    };
    dispatch(updatedEvent(updateEvent));
  };
  return(
    <>
      <label > Title
        <input 
          className="editTitle"
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <br />
      <select
        defaultValue={category}
        onChange={(e) => setCatrgory(e.target.value)}
        className="editCategory"
      >
        <option value="basketball">BasketBall</option>
        <option value="football">Football</option>
        <option value="baseball">Baseball</option>
        <option value="tennis">Tennis</option>
        <option value="soccer">Soccer</option>
        <option value="hockey">Hockey</option>
      </select>
      <br />
      <label > Attendees Max
        <input 
          className="editAttendeesMax"
          type="text" 
          defaultValue={attendeesMax}
          // placeholder="Value must be greater than 1"
          onChange={(e) => setAttendeesMax(e.target.value)}
        />
      </label>
      <br />
      <label > Date of Event
        <input 
          className="editAttendeesMax"
          type="date" 
          defaultValue={date}
          // placeholder="Value must be greater than 1"
          onChange={(e) => setDate(e.target.value)}
        />
      </label>
      <br />
      <label > Description 
        <input 
          className="editDescription"
          type="textarea" 
          maxLength="3000"
          defaultValue={description}
          // placeholder="Describe your event"
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <br />
      <select
        defaultValue={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
        className="editDifficulty"
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
      <br />
      <label > Address
        <input 
          className="editAddress"
          type="text" 
          defaultValue={address}
            
          onChange={(e) => setAddress(e.target.value)}        
        />
      </label>
      <br />
      <label > Zipcode
        <input 
            className="editZipcode"
            type="text" 
            defaultValue={zipcode}
            onChange={(e) => setZipcode(e.target.value)}
        />
      </label>
      <button onClick={handleSubmit}>Submit</button>
    </>
  );

}

export default Edit;

import { useEffect } from 'react';
import { fetchEvent, attendEvent, unAttendEvent , deleteEvent} from '../../store/events';
import { useParams, useNavigate} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { getCurrentUser } from '../../store/session';
import "./EventShow.css";



function EventShowPage() {
  const navigate = useNavigate();
  const { eventId } = useParams(); 
  const dispatch = useDispatch();
  const event = useSelector(state => state.events.new);
  const currentUser = useSelector(state => state.session.user);
  console.log(currentUser)
  const currentUserId = useSelector(state => state.session.user?._id);

  useEffect(() => {
    dispatch(fetchEvent(eventId));
  }, [dispatch, eventId]);

  useEffect(() => {
    dispatch(getCurrentUser());
  });
  // const state = useSelector(state => state);

  const isUserAttending = event?.attendees?.some(attendee => attendee._id === currentUserId);
  const isCoordinator = event?.coordinator?.["_id"] === currentUserId


  // const handleAttendClick = () => {
  //     if (!isUserAttending) {
  //         dispatch(attendEvent(eventId));
  //     }
  // };

  // const handleUnattendClick = () => {
  //     if (isUserAttending) {
  //         dispatch(unAttendEvent(eventId));
  //     }
  // };


  const handleAttendClick = async () => {
    try {
      await dispatch(attendEvent(eventId));
      dispatch(fetchEvent(eventId));
    } catch (error) {
      console.log("oh no");
    }
  };
    
  const handleUnattendClick = async () => {
    try {
      await dispatch(unAttendEvent(eventId));
      dispatch(fetchEvent(eventId)); 
    } catch (error) {
      console.log("shit");
    }
  };

  const handleEditClick = () => {
    navigate(`/events/edit/${eventId}`);
  }

  // const handleDelete = async () => {
  //   try {

  //     await dispatch(deleteEvent(eventId));
  //   } catch (error) {
  //     console.log(eventId)
  //     console.log("shit");
  //   }
  // }

  const handleDelete = e => {
    e.preventDefault();
    dispatch(deleteEvent(eventId));
    navigate(`/profile/${currentUserId}`)
  }

  if (!event) {
    return (
      <h1>Loading...</h1>
    );
  } else {
    const formattedDate = event.date ? new Date(event.date).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    }) : 'Date not available';
    
    const attendeesList = event.attendees?.map((attendee, index) => {
      const handleUserProfile = (e) => {
        e.preventDefault();
        navigate(`/profile/${attendee["_id"]}`);
      };
      return(

        <li className="eventShowAttendee" onClick={handleUserProfile}key={index}>
          {attendee.fname?.slice(0,1).toUpperCase() + attendee.fname?.slice(1) + " " + attendee.lname?.slice(0,1).toUpperCase() + attendee.lname?.slice(1)}
        </li>
      ); 
    }
    );
    

    return (
      <div className='eventShowPageWrapper'>
        <div className='event-wrapper-info'>
          <img className="eventShowPic" src={event.pictureUrl} alt="eventPicture" height={300} width={300}/>
          
          {isCoordinator && 
          <>
            <button className='deleteBtn' onClick={handleDelete}>Delete</button>
            <button className='editBtn' onClick={handleEditClick}>Edit Event</button>
          </>
            

          }
          {(isUserAttending && currentUser) ? (
            <button className="unattendBtn"onClick={handleUnattendClick}>Unattend</button>
          ) : (
            <button className="attendBtn"onClick={handleAttendClick}>Attend</button>
          )}
          <div className='eventShowInfoWrapper'>
            
            <div className='eventShowDetails'>
              <h2>{event.title}</h2>
              <p>Date: {formattedDate}</p>
              <p>Description: {event.description}</p>
              <p>Category: {event.category}</p>
              <p>{`Address: ${event.location.address} ${event.location.zipcode}`} </p>
              <a target="_blank" href={`https://maps.google.com/?q=${event.location.address}, ${event.location.zipcode}`} rel="noreferrer">Directions</a>
            </div>
            <div className='eventShowAttendanceWrapper'>
              <h2>Attendees</h2>
              <ul>{attendeesList}</ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EventShowPage;
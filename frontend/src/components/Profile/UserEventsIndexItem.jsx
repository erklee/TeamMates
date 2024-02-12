import './UserEventsIndexItem.css';
import allSports from "../../assets/images/allSports.jpeg";
import {useNavigate} from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function UserEventsIndexItem({event}) {
  const currentUser = useSelector(state => state.session.user);
  const isCoordinator = event?.coordinator?.["_id"] === currentUser?.["_id"]
  function capitalizeEveryWord(str) {
    const words = str.split(' ');
    for (let i = 0; i < words.length; i++) {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
    return words.join(' ');
  }

  const navigate = useNavigate();
  
  function formatDate(inputDateString) {
    const dateObject = new Date(inputDateString);
    const monthNames = [
      "January", "February", "March", "April",
      "May", "June", "July", "August",
      "September", "October", "November", "December",
    ];
    const monthName = monthNames[dateObject.getMonth()];
    const day = dateObject.getDate();
    const year = dateObject.getFullYear();
    const formattedDate = `${monthName} ${day}, ${year}`.trim();
    return formattedDate;
  }

  const formattedTime = event.date ? new Date(event.date).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit',
  }) : 'Time not available';
  
  const handleEventShow = e => {
    e.preventDefault();
    navigate(`/events/${event["_id"]}`);
  };

  const handleEdit = e => {
    e.preventDefault
    navigate(`/events/edit/${event["_id"]}`);
  }

  return (
    <div className="userEventsIndexItemContainter">
      <div className='userEventsItemWrapper'>

        <div className='userEventsImageContainer'>
          <div className="userEventsImageOverlayText" onClick={handleEventShow} >Go To Event</div>
          <img src={event.pictureUrl || allSports} alt="Event Picture"
            height={400} width={400} className="userEventsItemPic"onClick={handleEventShow}
          />
        </div>
        {isCoordinator &&
          <button className='userEventsItemEditButton' onClick={handleEdit}>Edit</button>
        } 
        <div className='userEventItemInfoWrapper'>
          <h1 className='userEventItemTitle' onClick={handleEventShow}>{capitalizeEveryWord(event.title)}</h1>
          <div className='userEventItemInfo'>

            <p><span>Description:</span> {`${event.description}`}</p>
            <p><span>Sport:</span> {`${event.category?.slice(0,1).toUpperCase()}${event.category?.slice(1)}`}</p>
            <p><span>Difficulty:</span> {`${event.difficulty?.slice(0,1).toUpperCase()}${event.difficulty?.slice(1)}`}</p>
            <p><span>Address:</span> {`${event.location?.address} ${event.location?.zipcode}`}</p>
            <p><span>Date:</span> {`${formatDate(event?.date)}`}</p>
            <p><span>Time:</span> {`${formattedTime}`}</p>
            <p><span>Participants:</span> {`${event.attendees?.length}`}</p>
            <a target="_blank" href={`https://maps.google.com/?q=${event.location.address}, ${event.location.zipcode}`} rel="noreferrer">Directions</a>
          </div>
        </div>
      </div>
      <br />
      <hr />
    </div>
    
  );
}
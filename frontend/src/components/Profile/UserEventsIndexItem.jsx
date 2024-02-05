import './UserEventsIndexItem.css';
import allSports from "../../assets/images/allSports.jpeg";
import {useNavigate} from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function UserEventsIndexItem({event}) {
  const currentUser = useSelector(state => state.session.user);
  const isCoordinator = event?.coordinator?.["_id"] === currentUser["_id"]

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

        {<img src={event.pictureUrl || allSports} alt="Event Picture" 
          height={400} width={400} className="userEventsItemPic"onClick={handleEventShow}
        />}
        {isCoordinator &&
          <button className='userEventsItemEditButton' onClick={handleEdit}>Edit</button>
        } 
        <div className='userEventItemInfoWrapper'>
          <h1 className='userEventItemTitle' onClick={handleEventShow}>{event.title}</h1>
          <div className='userEventItemInfo'>

            <p>{`Description: ${event.description}`}</p>
            <p>{`Sport: ${event.category?.slice(0,1).toUpperCase()}${event.category?.slice(1)}`}</p>
            <p>{`Address: ${event.location?.address} ${event.location?.zipcode}`}</p>
            <p>{`Date: ${formatDate(event?.date)}`}</p>
            <p>{`Particpants: ${event.attendees?.length}`}</p>
            <a target="_blank" href={`https://maps.google.com/?q=${event.location.address}, ${event.location.zipcode}`} rel="noreferrer">Directions</a>
          </div>
        </div>
      </div>
      <br />
      <hr />
    </div>
    
  );
}
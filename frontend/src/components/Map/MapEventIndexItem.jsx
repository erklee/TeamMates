import "./MapEventIndex.css";
import {useNavigate} from 'react-router-dom';


const MapEventIndexItem = ({event}) => {
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
    // console.log(selectedMarker.event["_id"])
    console.log(event);
    navigate(`/events/${event?._id}`);
  };

  return (
    <>

      
      <div className="mapEventIndexItem" key={event?._id}>
        <div className="mapIndexItemImgContainer"> 
          <div className="mapIndexItemOverlayText" onClick={handleEventShow} >Go To Event</div>
          <img src={event?.pictureUrl} onClick={handleEventShow} className="mapIndexItemPic" alt="picture"/>
        </div>
        {/* <img src={event.pictureUrl} alt="picture"/> */}
        <div className="mapIndexItemDetails">
          <p>{event?.title.slice(0,1).toUpperCase() + event?.title.slice(1)}</p>
          <p>{`Description: ${event?.description}`}</p>
          <p>{`Sport: ${event?.category.slice(0,1).toUpperCase()}${event.category?.slice(1)}`}</p>
          <p>{`Address: ${event?.location.address} ${event?.location.zipcode}`}</p>
          <p>{`Difficulty: ${event?.difficulty}`}</p>
          <p>{`Date: ${formatDate(event?.date)}`}</p>
          <p>{`Participants: ${event?.attendees?.length}`}</p>
        </div>
        <hr />
      </div>
      
    
    </>
  );
};

export default MapEventIndexItem;
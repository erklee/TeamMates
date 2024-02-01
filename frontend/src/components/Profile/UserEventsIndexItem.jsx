import './UserEventsIndexItem.css'
import allSports from "../../assets/images/allSports.jpeg"

export default function UserEventsIndexItem({event}) {
    function formatDate(inputDateString) {
    const dateObject = new Date(inputDateString);
    const monthNames = [
      "January", "February", "March", "April",
      "May", "June", "July", "August",
      "September", "October", "November", "December"
    ];
    const monthName = monthNames[dateObject.getMonth()];
    const day = dateObject.getDate();
    const year = dateObject.getFullYear();
    const formattedDate = `${monthName} ${day}, ${year}`.trim();
    return formattedDate;
  }
  return (
    <div className="userEventsIndexItemContainter">
      <div className='userEventsItemWrapper'>
        {<img src={event.pictureUrl || allSports} alt="Event Picture" height={400} width={400} />}
        <div className='userEventItemInfoWrapper'>
          <h1 className='userEventItemTitle'>{event.title}</h1>
          <div className='userEventItemInfo'>

            <p>{`Description: ${event.description}`}</p>
            <p>{`Sport: ${event.category.slice(0,1).toUpperCase()}${event.category.slice(1)}`}</p>
            <p>{`Address: ${event.location.address} ${event.location.zipcode}`}</p>
            <p>{`Date: ${formatDate(event.date)}`}</p>
            <p>{`Particpants: ${event.attendees.length}`}</p>
          </div>
        </div>
      </div>
      <br />
      <hr />
    </div>
    
  )
}

import UserEventsIndexItem from "./UserEventsIndexItem";
import './UserEventsIndex.css';

export default function UserEventsIndex({userEvents}) {


  const sortedEvents = Object.values(userEvents).sort(function (a, b){
    let dateA = new Date(a.date);
    let dateB = new Date(b.date);
    return dateB - dateA;
  });
  return (
    <div>
      <h1 className="UserEventsIndexTitle">My Events</h1>
      {/* {Object.values(userEvents) */}
      { sortedEvents.map((event) => (
          
        
        <div className="userEventsIndexItemWrapper" key={event?._id}>
          <UserEventsIndexItem event={event} />
        </div>
      ))}

  
    </div>

  );
  
  
}

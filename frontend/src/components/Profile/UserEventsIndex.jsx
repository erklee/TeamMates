
import UserEventsIndexItem from "./UserEventsIndexItem";
import './UserEventsIndex.css'

export default function UserEventsIndex({userEvents}) {
  console.log(typeof userEvents)
  console.log(userEvents)
  return (
    <div>
      <h1 className="UserEventsIndexTitle">My Events</h1>
      {Object.values(userEvents).map((event) => (
          
          
        <div className="userEventsIndexItemWrapper" key={event.id}>
          <UserEventsIndexItem event={event} />
        </div>
      ))}

  
    </div>

  );
  
  
}

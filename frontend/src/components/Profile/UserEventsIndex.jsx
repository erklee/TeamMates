
import UserEventsIndexItem from "./UserEventsIndexItem";
import './UserEventsIndex.css'

export default function UserEventsIndex({userEvents}) {
  return (
    <div>
      <h1 className="UserEventsIndexTitle">My Events</h1>
      {Object.values(userEvents).map((event) => (
          
          
        <div className="userEventsIndexItemWrapper" key={event?._id}>
          <UserEventsIndexItem event={event} />
        </div>
      ))}

  
    </div>

  );
  
  
}

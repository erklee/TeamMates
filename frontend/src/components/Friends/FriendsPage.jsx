import { useState } from "react";
import FriendsIndex from "./FriendsIndex";
import PendingFriendIndex from "./PendingFriendIndex";
import Footer from "../AboutUs/Footer";
import './FriendsPage.css';

export default function FriendsPage() {
  const [friendsVisible, setFriendsVisible] = useState(true);
  const [requestsVisible, setRequestsVisible] = useState(false);

  const handleFriendsIndex = e =>  {
    e.preventDefault();
    setFriendsVisible(true);
    setRequestsVisible(false);
  };
  const handleRequestsIndex = e =>  {
    e.preventDefault();
    setFriendsVisible(false);
    setRequestsVisible(true);
  };

  return (
    <div>
      <div className="friendsPageWrapper">
        <div className="friendsPageContainer">
          <div className="friendsPageVisibilityButton">
            <button onClick={handleFriendsIndex}>My Friends</button>
            <button onClick={handleRequestsIndex}>Requests</button>
          </div>
          { friendsVisible && < FriendsIndex /> }
          { requestsVisible && < PendingFriendIndex /> }
        </div>


      </div>
      {/* <Footer /> */}
    </div>
  );


}


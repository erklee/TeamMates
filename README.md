# TeamMates

![Splash Screen GIF](./frontend/src/assets/images/Splash2_landscape.gif "Splash screen animation showcasing the app")

## Introduction

Are you lonely? Do you need more physical activities in your life but aren't sure where to start? TeamMates is the solution you've been searching for! Our application enables you to initiate the change you need in your life and meet all the friends you'll ever need. Organize sporting events and connect with other users to get moving and create lasting friendships. [CHECK IT OUT!](https://teammates.onrender.com/)

TeamMates is an application where users can organize sporting events and connect with each other. New users can discover events near them based on their current location and receive directions to the event. Once signed in, users can create their own events based on their preferences (e.g., sport category, address, date). If they're unhappy with their event for any reason, they can make changes or delete it entirely. Users can also connect with others by viewing profiles and seeing what events they're attending.

## Technologies

**Frontend:**
- React-Redux for state management and UI.

Backend and Routes:
- Express.js for handling API requests.
- MongoDB for non-relational, online database.

**Hosting:**
- Render

**Languages:**
- JavaScript
- HTML & CSS

**Tools:**
- AWS Cloud Storage S3
- Google Maps API for location-based services and directions.

## MVP Features

**Events**

- **User Authorization:** Secure login and user authentication.
- **Event Management:** Users can create, update, and delete events if they are the coordinator.
- **Google Maps Integration:** View events on Google Maps based on location and filters such as sport type or difficulty.
- **Attendance Management:** Users can choose to attend or unattend events.

**Friends**

- **Social Connection:** View profiles of attendees and add them as friends.

## Code Snippets

The following code snippet shows a piece of the backend logic for validating event creation. This snippet ensures that events are created with valid titles, future dates, and a minimum number of attendees, alongside performing address validation using the Google Maps API.


```javascript
const validateEventCreation = [
    check("title")
        .exists({ checkFalsy: true })
        .withMessage("Title is invalid."),
    check("date")
        .exists({ checkFalsy: true })
        .withMessage("You must enter a date.")
        .custom(value => {
            let time;
            try {
                time = new Date(value).getTime(); 
            } catch(err) {
                return new Error("Date cannot be parsed.")
            }
            return new Date(time - 172800000) > Date.now() 
            // 172800000 milliseconds equals 2 days. This ensures the event is planned at least 2 days ahead. Date.now() returns the number of milliseconds
            // that have passed since 12:00AM January 1st, 1970. This works in all cases to return
            // true or false depending on whether or not the new Event is set for at least 2 days from now.
        })
        .withMessage("Date must be at least 2 days from now."),
    check("attendeesMax")
        .custom(value => {
            return value >= 2;
        })
        .withMessage("Event must have at least 2 attendees at maximum capacity."),

```

### Continuation of validations

After parsing the google maps address validation and store the response, we can check if it came back with a status of "OK" and continue validations.

```javascript
    check("location")
        .custom(async locationObj => {
            const res = await fetch(`https://addressvalidation.googleapis.com/v1:validateAddress?key=${process.env.VITE_APP_GOOGLE_MAPS_API_KEY}`, {
                method: 'POST',
                body: JSON.stringify({ address: { addressLines: [locationObj.address + locationObj.zipcode]}}),
            });

            if(res.ok) {
                const addressValidationData = await res.json();
                const validComponents = addressValidationData
                    .result
                    .address
                    ?.addressComponents
                    ?.filter(component => component.confirmationLevel === 'CONFIRMED')
                    ?.map(component => component.componentType);
                if(validComponents === undefined) return Promise.reject();
                if(!['street_number', 'route', 'locality', 'country'].every(component => validComponents.includes(component))) return Promise.reject();
            } else return Promise.reject();
        })
        .withMessage("Address is invalid."),
    handleValidationErrors
];

```
If the reponse came back with a status of "OK" we will continue to peform validations. 
While a zipcode are in all addresses, it's not mandatory for an address to be considered valid. The focus here is on is making sure the address has the following: 'street_number', 'route', 'locality', and 'country'. When these components are verified as included within the valid components array, it shows that the address has been validated and can be shown on Google Maps.


```Javascript
          if(res.ok) {
                // So with this in mind, first we parse the response into a JSON object.
                const addressValidationData = await res.json();
                // Then we key into the addressComponents...
                const validComponents = addressValidationData
                    .result
                    .address
                    ?.addressComponents // ...Filter them down to only confirmed components...
                    ?.filter(component => component.confirmationLevel === 'CONFIRMED') // ... and store the names of the components in an array.
                    ?.map(component => component.componentType);
                if(validComponents === undefined) return Promise.reject(); // Error handling
                if(!['street_number', 'route', 'locality', 'country'].every(component => validComponents.includes(component))) return Promise.reject();
            }
            else return Promise.reject();
        })
        .withMessage("Address is invalid."),
        
    handleValidationErrors
]

```

## Google Maps API

Here we are filtering events based on user selection such as category of sports or the difficulty level. For each event, there is a request to the Google Maps API's geocode endpoint which includes the event's address. Once the response is received, we extract the geo location data (longitude and latitude) for the address of the event. We are then able to calculate teh distance of each event from the user's currenct location.

```JavaScript

 useEffect(() => {
    const geocodeAddresses = async () => {
      try {
        const results = await Promise.allSettled(
          events
          .filter((event) => 
          (!selectedCategory || event.category === selectedCategory) && 
          (!selectedDifficulty || event.difficulty === selectedDifficulty)
        )
            .map(async (event) => {
              try {
                const response = await fetch(
                  `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                    event.location.address
                  )}&key=${import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY}`
                );

                const data = await response.json();

                if (data.status === "OK" && data.results && data.results.length > 0) {
                  const location = data.results[0].geometry.location;
                  const distance = calculateDistance(
                    userLocation?.lat,
                    userLocation?.lng,
                    location.lat,
                    location.lng
                  );

                  return { id: event.id, position: location, event, distance };
                }
              } catch (error) {
                console.error("Error geocoding address:", error);
                return null;
              }
            })
        );

```

Some math for the distance options.
Some gif here.

```javascript
 const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const calculateZoomLevel = (distance) => {
   
    let zoom;

    if (distance === 1) {
      zoom = 15; 
    } if (distance === 5){
        zoom = 13
    } if (distance === 10){
        zoom = 12
    }
    if (distance === 15){
        zoom = 11
    }if (distance === 25){
        zoom = 10.5
    }if (distance === 50){
      zoom = 9.5
  }

   
    return zoom;
  };
```

## Video Player

Using React's state management we were able to randomize and loop videos to showcase a series of videos.

```javascript
const VideoPlayer = () => {

...

  const [currentVideoIndex, setCurrentVideoIndex] = useState(Math.floor(Math.random() * 6));

  useEffect(() => {
    const videoElement = document.getElementById('video-player');
    
    if (currentVideoIndex < videos.length) {

      videoElement.src = videos[currentVideoIndex];
      videoElement.play();
    }
  }, [videos, currentVideoIndex]);

  const handleVideoEnded = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  ...
```

## Friends

Our platform implements a system to manage your friends, allowing users to to handle interactions such as accepting/rejecting friend requests, unfriending other users in the frontend. The following is a code snippet showcasing the handling of pending friend requets in the frontend.


```javascript
const PendingFriend = (friendrequest) => {
    const dispatch = useDispatch()
    return(
        <div>
            <span>{friendrequest?.friendrequest?.fname} {friendrequest?.friendrequest?.lname} <button onClick={() => dispatch(rejectFriendRequestThunk(String(friendrequest?.friendrequest?._id)))}>Reject</button><button onClick={() => dispatch(acceptFriendRequestThunk(String(friendrequest?.friendrequest?._id)))}>Accept</button>
            </span>
        </div>
    )
}


```
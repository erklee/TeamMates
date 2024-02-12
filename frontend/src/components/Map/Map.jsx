import { useEffect, useState } from "react";
import { GoogleMap, Marker, InfoWindow, LoadScript, MarkerF } from "@react-google-maps/api";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../../store/events";
import { selectAlleventsArray } from "../../store/events";
import spinping from "../../assets/images/spin-trans.gif";
import { useLocation, useNavigate } from 'react-router-dom';

import './map.css';


const EventMap = () => {
  const {state} =  useLocation();
  const { sport } = state || {};
  const events = useSelector(selectAlleventsArray);
  const navigate = useNavigate();
  const [markers, setMarkers] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(sport ||"");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [filterRange, setFilterRange] = useState(10);
  const dispatch = useDispatch();

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
    navigate(`/events/${selectedMarker.event["_id"]}`);
  };

  const handleCategoryButton = e => {
    e.preventDefault();
    if (selectedCategory === e.target.name) {
      setSelectedCategory("");
    } else {
      setSelectedCategory(e.target.name);
    }
  };

  const handleDifficultyButton = e => {
    e.preventDefault();
    if (selectedDifficulty === e.target.name) {
      setSelectedDifficulty("");
    } else {
      setSelectedDifficulty(e.target.name);
    }
  };

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  // useEffect(() => {
  //   dispatch(fetchEvents())
  // }, []);

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

        const newMarkers = results
          .filter((result) => result.status === "fulfilled" && result.value !== null)
          .map((result) => result.value)
          .filter((marker) => marker?.distance !== undefined && marker.distance <= filterRange);

        if (isMounted) {
          setMarkers(newMarkers);
        }
      } catch (error) {
        console.error("Error in geocodeAddresses:", error);
      }
    };

    let isMounted = true;

    geocodeAddresses();

    return () => {
      isMounted = false;
    };
  }, [events, userLocation, selectedCategory, selectedDifficulty, filterRange, dispatch]);

  useEffect(() => {
    const getUserLocation = () => {
      let confirmGeolocation;
      if (!sessionStorage.getItem('confirmedLocation')) {
        confirmGeolocation = window.confirm("This app would like to use your location. Allow?");
        sessionStorage.setItem("confirmedLocation", `${confirmGeolocation}`);
      } else {
        confirmGeolocation = JSON.parse(sessionStorage.getItem('confirmedLocation'));
      }

      if (confirmGeolocation && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            console.error("Error getting user location:", error);
          },
          { enableHighAccuracy: true }
        );
      } else {
        console.log("User denied geolocation access or not supported.");
        setUserLocation({ lat: 40.71679995490363, lng: -73.99771308650402 });
      }
    };

    getUserLocation();
  }, []);

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
      zoom = 13;
    } if (distance === 10){
      zoom = 12;
    }
    if (distance === 15){
      zoom = 11;
    }if (distance === 25){
      zoom = 10.5;
    }if (distance === 50){
      zoom = 9.5;
    }

   
    return zoom;
  };

  const filterRangeOptions = [1, 5, 10, 15, 25, 50];

  const closeInfoWindow = () => {
    setSelectedMarker(null);
  };

  const containerStyle = {
    width: '70vw',
    height: '100vh',
  };

  const img = {
    url: spinping,
  };

  return (
    <div className="eventMapWrapper">
      <div className="eventIndexSideBar">
        <div className="filters">
          {/* <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="basketball">Basketball</option>
            <option value="football">Football</option>
            <option value="baseball">Baseball</option>
            <option value="tennis">Tennis</option>
            <option value="soccer">Soccer</option>
            <option value="hockey">Hockey</option>
          </select> */}
          <div>
            <div className="filterCategoryButtonWrapper">
              <p>Category:</p>
              <div className="filterCategoryButtonsContainer">
                <div className="categoryButtonRow">
                  <button name="basketball" onClick={handleCategoryButton} className={`filterCategoryButtons ${selectedCategory === "basketball" ? "selected" : ""}`}>Basketball</button>
                  <button name="football" onClick={handleCategoryButton} className={`filterCategoryButtons ${selectedCategory === "football" ? "selected" : ""}`}>Football</button>
                  <button name="hockey" onClick={handleCategoryButton} className={`filterCategoryButtons ${selectedCategory === "hockey" ? "selected" : ""}`}>Hockey</button>

                </div>
                <div className="categoryButtonRow">
                  <button name="baseball" onClick={handleCategoryButton} className={`filterCategoryButtons ${selectedCategory === "baseball" ? "selected" : ""}`}>Baseball</button>
                  <button name="tennis" onClick={handleCategoryButton} className={`filterCategoryButtons ${selectedCategory === "tennis" ? "selected" : ""}`}>Tennis</button>
                  <button name="soccer" onClick={handleCategoryButton} className={`filterCategoryButtons ${selectedCategory === "soccer" ? "selected" : ""}`}>Soccer</button>
                </div>
                {/* <div className="categoryButtonRow">
                
              </div> */}
              </div>
            </div>

            <div className="filterCategoryButtonWrapper">
              <p>Difficulty:</p>
              <div className="filterCategoryButtonsContainer">
                <div className="categoryButtonRow">
                  <button name="easy" onClick={handleDifficultyButton} className={`filterCategoryButtons ${selectedDifficulty === "easy" ? "selected" : ""}`}>Easy</button>
                  <button name="medium" onClick={handleDifficultyButton} className={`filterCategoryButtons ${selectedDifficulty === "medium" ? "selected" : ""}`}>Medium</button>
                  <button name="hard" onClick={handleDifficultyButton} className={`filterCategoryButtons ${selectedDifficulty === "hard" ? "selected" : ""}`}>Hard</button>
                </div>
              </div>
            </div>
          </div>

          {/* <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
          >
            <option value="">All Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select> */}

          <div className="filterRange">
            <p>Filter Range:</p>
            <select value={filterRange} onChange={(e) => setFilterRange(parseInt(e.target.value))}>
              {filterRangeOptions.map((option, index) => (
                <option key={`${option?.id} ${index}`} value={option}>
                  {`${option} mile${option > 1 ? "s" : ""} away`}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="eventInfoWrapper">
          {selectedMarker && 
            <div className="eventInfo">
              <div className="sideBarEventImgContainer"> 
                <div className="sideBarImgOverlayText" onClick={handleEventShow} >Go To Event</div>
                <img src={selectedMarker.event.pictureUrl} onClick={handleEventShow} alt="picture"/>
              </div>
              {/* <img src={selectedMarker.event.pictureUrl} alt="picture"/> */}
              <div className="eventInfoDetails">
                <p>{selectedMarker.event.title.slice(0,1).toUpperCase() + selectedMarker.event.title.slice(1)}</p>
                <p>{`Description: ${selectedMarker.event.description}`}</p>
                <p>{`Sport: ${selectedMarker.event.category.slice(0,1).toUpperCase()}${selectedMarker.event.category.slice(1)}`}</p>
                <p>{`Address: ${selectedMarker.event.location.address} ${selectedMarker.event.location.zipcode}`}</p>
                <p>{`Date: ${formatDate(selectedMarker.event.date)}`}</p>
                <p>{`Participants: ${selectedMarker.event.attendees.length}`}</p>
              </div>
            </div>
          }
        </div>
      </div>
      <div>
        <LoadScript
          googleMapsApiKey={import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY}
          
        >
          <GoogleMap 
            mapContainerStyle={containerStyle}
            center={userLocation || { lat: 40.71679995490363, lng: -73.99771308650402 }}
            zoom={calculateZoomLevel(filterRange)}
            onLoad={() => console.log("Map is loaded")}
          >
            {userLocation && window.google && window.google.maps && (
              <MarkerF
                position={userLocation}

              
                animation={window.google.maps.Animation.BOUNCE}
                icon={img}
              />
            )}


            {markers.map((marker, index) => (
              <Marker
                key={`${marker.id} ${index}`}
                position={marker.position}
                onClick={() => {
                  setSelectedMarker(marker); 
                }}
              />
            ))}
            {selectedMarker && (
              <InfoWindow
                position={selectedMarker.position}
                onCloseClick={closeInfoWindow}
              >
                <div className="infoWindowDetailsContainer">
                  <h6>{selectedMarker.event.title}</h6>
                  <p>{selectedMarker.event.description}</p>
                  <p>Difficulty: {selectedMarker.event.difficulty}</p>
                  <p>Distance: {selectedMarker.distance.toFixed(2)} miles</p>
                  <a target="_blank" href={`https://maps.google.com/?q=${selectedMarker.event.location.address}, ${selectedMarker.event.location.zipcode}`} rel="noreferrer">Directions</a>

                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

export default EventMap;











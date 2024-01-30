import { useEffect, useState } from "react";
import { GoogleMap, Marker, InfoWindow, LoadScript } from "@react-google-maps/api";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../../store/events";

// ... (previous imports and code)

const EventMap = () => {
    const events = useSelector((state) => Object.values(state.events.all));
    const [markers, setMarkers] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [filterRange, setFilterRange] = useState(10);
    const dispatch = useDispatch();
  
    useEffect(() => {
      dispatch(fetchEvents());
    }, [dispatch]);
  
    useEffect(() => {
      const geocodeAddresses = async () => {
        const newMarkers = await Promise.all(
          events
            .filter((event) => !selectedCategory || event.category === selectedCategory)
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
  
                  // Return the marker information along with event details
                  return { id: event.id, position: location, event, distance };
                }
              } catch (error) {
                console.error("Error geocoding address:", error);
              }
  
              return null;
            })
        );
  
        setMarkers(newMarkers.filter((marker) => marker !== null && marker.distance <= filterRange));
      };
  
      geocodeAddresses();
    }, [events, userLocation, selectedCategory, filterRange]);
  
    useEffect(() => {
      const getUserLocation = () => {
        const confirmGeolocation = window.confirm(
          "This app would like to use your location. Allow?"
        );
  
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
        }
      };
  
      getUserLocation();
    }, []);
  
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Radius of the Earth in kilometers
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      return distance;
    };
  
    const filterRangeOptions = [1, 10, 20, 50];
  
    const containerStyle = {
      width: '100vw',
      height: '100vh'
    };
  
    return (
      <div className="eventMapWrapper">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {/* Replace the following categories with your actual category values */}
          <option value="basketball">BasketBall</option>
          <option value="football">Football</option>
          <option value="baseball">Baseball</option>
          <option value="tennis">Tennis</option>
          <option value="soccer">Soccer</option>
          <option value="hockey">Hockey</option>
          {/* Add more options as needed */}
        </select>
        <br />
        <label>
          Filter Range:
          <select value={filterRange} onChange={(e) => setFilterRange(parseInt(e.target.value))}>
            {filterRangeOptions.map((option) => (
              <option key={option} value={option}>
                {`${option} mile${option > 1 ? "s" : ""} away`}
              </option>
            ))}
          </select>
        </label>
  
        <LoadScript googleMapsApiKey={import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={userLocation || { lat: 40.78585773023068, lng: -73.46763094030253 }}
            zoom={10}
            onLoad={() => console.log("Map is loaded")}
          >
            {userLocation && <Marker position={userLocation} />}
            {markers.map((marker) => (
              <Marker
                key={marker.id}
                position={marker.position}
                onClick={() => setSelectedMarker(marker)}
              />
            ))}
            {selectedMarker && (
              <InfoWindow
                position={selectedMarker.position}
              >
                <div>
                  <h2>{selectedMarker.event.name}</h2>
                  <p>{selectedMarker.event.description}</p>
                  <p>Distance: {selectedMarker.distance.toFixed(2)} miles</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </div>
    );
  };
  
  export default EventMap;
  




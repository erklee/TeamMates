import { useEffect, useState } from "react";
import { GoogleMap, MarkerF, InfoWindow, LoadScript } from "@react-google-maps/api";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../../store/events";

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
                  event.address
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
        // Handle the case where the user denies geolocation access or geolocation is not supported
      }
    };

    getUserLocation();
  }, []);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    // Function to calculate distance (unchanged)
  };


  const containerStyle = {
    width: '100%',
    height: '100%'
  };

  return (
    <div className="eventMapWrapper">
    <LoadScript googleMapsApiKey={import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userLocation } // Use a default center if userLocation is null
        zoom={10}
        onLoad={() => console.log("Map is loaded")}
      >
        {userLocation && <MarkerF position={userLocation} />}
        {markers.map((marker) => (
          <MarkerF
            key={marker.id}
            position={marker.position}
            onClick={() => setSelectedMarker(marker)}
          />
        ))}
        {selectedMarker && (
          <InfoWindow
            position={selectedMarker.position}
            onCloseClick={() => setSelectedMarker(null)}
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



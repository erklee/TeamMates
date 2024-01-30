import { useEffect, useState } from "react";
import { GoogleMap, Marker, InfoWindow, LoadScript, MarkerF } from "@react-google-maps/api";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../../store/events";
import { selectAlleventsArray } from "../../store/events";
import location from "../../assets/images/location4.png"

const EventMap = () => {
  const events = useSelector(selectAlleventsArray);
  const [markers, setMarkers] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filterRange, setFilterRange] = useState(10);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  useEffect(() => {
    const geocodeAddresses = async () => {
      try {
        const results = await Promise.allSettled(
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
  }, [events, userLocation, selectedCategory, filterRange, dispatch]);

  useEffect(() => {
    const getUserLocation = () => {
        let confirmGeolocation
        if (!sessionStorage.getItem('confirmedLocation')) {
          confirmGeolocation = window.confirm("This app would like to use your location. Allow?");
          sessionStorage.setItem("confirmedLocation", `${confirmGeolocation}`)
          console.log(confirmGeolocation)
          console.log(sessionStorage.getItem('confirmedLocation'))
        } else {
          confirmGeolocation = JSON.parse(sessionStorage.getItem('confirmedLocation'))
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

  const filterRangeOptions = [1, 5, 10, 15, 25, 50];

  const closeInfoWindow = () => {
    setSelectedMarker(null);
  };

  const containerStyle = {
    width: '100vw',
    height: '100vh',
  };

  const img = {
    url: location
}

  return (
    <div className="eventMapWrapper">
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">All Categories</option>
        <option value="basketball">BasketBall</option>
        <option value="football">Football</option>
        <option value="baseball">Baseball</option>
        <option value="tennis">Tennis</option>
        <option value="soccer">Soccer</option>
        <option value="hockey">Hockey</option>
      </select>

      <label>
        Filter Range:
        <select value={filterRange} onChange={(e) => setFilterRange(parseInt(e.target.value))}>
          {filterRangeOptions.map((option, index) => (
            <option key={`${option?.id} ${index}`} value={option}>
              {`${option} mile${option > 1 ? "s" : ""} away`}
            </option>
          ))}
        </select>
      </label>

      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY}
        libraries={["places"]}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={userLocation || { lat: 40.71679995490363, lng: -73.99771308650402 }}
          zoom={13}
          onLoad={() => console.log("Map is loaded")}
        >
          {userLocation && window.google && window.google.maps && (
            <MarkerF
              position={userLocation}
              icon={img}
            />
          )}

          {markers.map((marker, index) => (
            <Marker
              key={`${marker.id} ${index}`}
              position={marker.position}
              onClick={() => setSelectedMarker(marker)}
            />
          ))}
          {selectedMarker && (
            <InfoWindow
              position={selectedMarker.position}
              onCloseClick={closeInfoWindow}
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
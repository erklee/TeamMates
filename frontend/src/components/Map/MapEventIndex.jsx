import "./MapEventIndex.css";
import MapEventIndexItem from './MapEventIndexItem';

const MapEventIndex = ({ events, selectedCategory, selectedDifficulty }) => {
  let filters = {
    category: selectedCategory || "",
    difficulty: selectedDifficulty || "",
  };

  let filteredEvents = events.filter(event => {
    for (let key in filters) {
      if (filters[key] && event[key] !== filters[key]) {
        return false;
      }
    }
    return true;
  });

  if (filteredEvents.length === 0) {
    return (
      <>
        {events.map((event) => (
          <MapEventIndexItem event={event} key={event._id} />
        ))}
      </>
    );
  }

  return (
    <>
      {filteredEvents.map((event) => (
        <MapEventIndexItem event={event} key={event._id} />
      ))}
    </>
  );
};

export default MapEventIndex;

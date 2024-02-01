
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux"
import jwtFetch from '../../store/jwt';
import { useEffect } from 'react';
import { selectEventById } from '../../store/events';


function EventShowPage() {
    const { eventId } = useParams(); 
    const dispatch = useDispatch();
    const event = useSelector( selectEventById(eventId));

    useEffect(() => {
        dispatch((eventId));
    }, [dispatch, eventId]);


    const formattedDate = event.date ? new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    }) : 'Date not available';

    const attendeesList = event.attendees?.map((attendee, index) => 
        <li key={index}>{attendee.username}</li> 
    );

    const locationDisplay = event.location ? `${event.location.address}, ${event.location.city}, ${event.location.state} ${event.location.zipcode}` : 'Location not available';

    return (
        <div className='event-wrapper-info'>
            <h2>{event.name}</h2>
            <p>Date: {formattedDate}</p>
            <p>Description: {event.description}</p>
            <p>Category: {event.category}</p>
            <ul>Attendees: {attendeesList}</ul>
            <p>Location: {locationDisplay}</p> 
        </div>
    );
}

export default EventShowPage;

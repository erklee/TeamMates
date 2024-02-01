import jwtFetch from '../../store/jwt';
import { useEffect } from 'react';
import { selectEventById } from '../../store/events';
import { fetchEvent } from '../../store/events';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';



function EventShowPage() {
    const { eventId } = useParams(); 
    const dispatch = useDispatch();
    const event = useSelector(state => state.events.new);



    useEffect(() => {
        dispatch(fetchEvent(eventId));
    }, [dispatch, eventId]);

    if (!event) {
        return (
            <h1>Loading...</h1>
        )
    } else {




        const formattedDate = event.date ? new Date(event.date).toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        }) : 'Date not available';
        const attendeesList = event.attendees?.map((attendee, index) => 
            <li key={index}>{attendee.username}</li> 
        );
    

    return (
        <div className='event-wrapper-info'>
            <img src={event.pictureUrl} alt="eventPicture" height={300} width={300}/>
            <h2>{event.name}</h2>
            <p>Date: {formattedDate}</p>
            <p>Description: {event.description}</p>
            <p>Category: {event.category}</p>
            <ul>Attendees: {attendeesList}</ul>
            <p>{`Address: ${event.location.address} ${event.location.zipcode}`} </p>
        </div>
    );
    }
}

export default EventShowPage;
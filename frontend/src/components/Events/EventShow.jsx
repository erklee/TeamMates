
import { useEffect } from 'react';
import { fetchEvent, attendEvent, unAttendEvent } from '../../store/events';
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
    const state = useSelector(state => state);


    console.log(state);

    const userId = useSelector(state => state.session.user?._id);

    const isUserAttending = event?.attendees?.some(attendee => attendee._id === userId);

    // const handleAttendClick = () => {
    //     if (!isUserAttending) {
    //         dispatch(attendEvent(eventId));
    //     }
    // };

    // const handleUnattendClick = () => {
    //     if (isUserAttending) {
    //         dispatch(unAttendEvent(eventId));
    //     }
    // };

    
    const handleAttendClick = async () => {
        try {
            await dispatch(attendEvent(eventId));
            dispatch(fetchEvent(eventId));
        } catch (error) {
            console.log("oh no")
        }
    };
    
    const handleUnattendClick = async () => {
        try {
            await dispatch(unAttendEvent(eventId));
            dispatch(fetchEvent(eventId)); 
        } catch (error) {
            console.log("shit")
        }
    };

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

            {isUserAttending ? (
                <button onClick={handleUnattendClick}>Unattend</button>
            ) : (
                <button onClick={handleAttendClick}>Attend</button>
            )}
        </div>
    );
    }
}

export default EventShowPage;
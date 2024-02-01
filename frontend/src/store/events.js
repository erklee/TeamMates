import jwtFetch from './jwt';
import { RECEIVE_USER_LOGOUT } from './session';

const RECEIVE_EVENTS = "events/RECEIVE_events";
const RECEIVE_USER_EVENTS = "events/RECEIVE_USER_events";
const RECEIVE_NEW_EVENT = "events/RECEIVE_NEW_EVENT";
const RECEIVE_EVENT_ERRORS = "events/RECEIVE_EVENT_ERRORS";
// const RECEIVE_EVENT = "events/RECEIVE_EVENT"
const REMOVE_EVENT = "events/REMOVE_EVENT"
const CLEAR_EVENT_ERRORS = "events/CLEAR_EVENT_ERRORS";
const ATTEND_EVENT = "events/ATTEND_EVENT"
const UNATTEND_EVENT = "events/UNATTEND_EVENT"

const receiveEvents = events => ({
  type: RECEIVE_EVENTS,
  events
});
// const receiveEvent = event => ({
//   type: RECEIVE_EVENT, 
//   event
// })
const receiveUserEvents = events => ({
  type: RECEIVE_USER_EVENTS,
  events
});

const receiveNewEvent = event => ({
  type: RECEIVE_NEW_EVENT,
  event
});

const receiveErrors = errors => ({
  type: RECEIVE_EVENT_ERRORS,
  errors
});

const removeEvent = (eventId) => ({
  type: REMOVE_EVENT,
  eventId
})


export const clearEventErrors = errors => ({
    type: CLEAR_EVENT_ERRORS,
    errors
});

export const attendEventAction = (eventId) => ({
  type: ATTEND_EVENT,
  eventId
})

export const unAttendEventAction = (eventId) => ({
  type: UNATTEND_EVENT,
  eventId
})
 
export const fetchEvents = () => async dispatch => {
  try {
    const res = await jwtFetch ('/api/events');
    const events = await res.json();
    dispatch(receiveEvents(events));
  } catch (err) {
    const resBody = await err.json();
    if (resBody.statusCode === 400) {
      dispatch(receiveErrors(resBody.errors));
    }
  }
};


export const fetchEvent = (eventId) => async dispatch => {
  try {
    const res = await jwtFetch (`/api/events/${eventId}`);
    const event = await res.json();
    dispatch(receiveNewEvent(event));
  } catch (err) {
    const resBody = await err.json();
    if (resBody.statusCode === 400) {
      dispatch(receiveErrors(resBody.errors));
    }
  }
};

export const fetchUserEvents = id => async dispatch => {
  try {
    const res = await jwtFetch(`/api/events/user/${id}`);
    const events = await res.json();
    dispatch(receiveUserEvents(events));
  } catch(err) {
    const resBody = await err.json();
    if (resBody.statusCode === 400) {
      return dispatch(receiveErrors(resBody.errors));
    }
  }
};

export const composeEvent = data => async dispatch => {
  try {
    const res = await jwtFetch('/api/events/', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    const event = await res.json();
    dispatch(receiveNewEvent(event));
  } catch(err) {
    const resBody = await err.json();
    if (resBody.statusCode === 400) {
      return dispatch(receiveErrors(resBody.errors));
    }
  }
};

export const updatedEvent = (updatedEvent) => async dispatch => {
  try{
  const res  = await jwtFetch(`/api/events/${updatedEvent._id}`, {
      method: "PATCH", 
      body: JSON.stringify(updatedEvent), 
  });
      const event = await res.json()
      dispatch(receiveNewEvent(event))
  } catch(err) {
    const resBody = await err.json()
    if (resBody.statusCode === 400) {
      return dispatch(receiveErrors(resBody.errors));
    }
  }
}

export const attendEvent = (eventId) => async dispatch => {
    const res  = await jwtFetch(`/api/events/${eventId}/attend`, {
        method: "PATCH", 
    });
      if(res.ok){
        const data = await res.json()
        dispatch(attendEventAction(data))
      }
}

export const unAttendEvent = (eventId) => async dispatch => {
  const res  = await jwtFetch(`/api/events/${eventId}/unattend`, {
    method: "PATCH", 
});
  if(res.ok){
    const data = await res.json()
    dispatch(unAttendEventAction(data))
  }
}

export const deleteEvent = (eventId) => async dispatch => {
  const res = await jwtFetch(`/api/reviews/${eventId}`, {
    method: "DELETE"
  })
  if(res.ok){
      dispatch(removeEvent(eventId))
  }
}
import { createSelector } from 'reselect';

// ...

const selectEvents = state => state.events.all;
const selectUserEvents = state => state.events.user;
export const selectAlleventsArray = createSelector(selectEvents,
 (events) => Object.values(events) 
);
export const selectUsereventsArray = createSelector (selectUserEvents,
  (events) => Object.values(events)
);

export const selectEventById = (eventId) => (state) => {
  return state?.events.all[eventId] || null
}

// export const selectEventById = (state, eventId) => {
//   const allEvents = selectEvents(state);
//   return allEvents[eventId];
// };

const nullErrors = null;

export const EventErrorsReducer = (state = nullErrors, action) => {
  switch(action.type) {
    case RECEIVE_EVENT_ERRORS:
      return action.errors;
    case RECEIVE_NEW_EVENT:
    case CLEAR_EVENT_ERRORS:
      return nullErrors;
    default:
      return state;
  }
};

const eventsReducer = (state = { all: {}, user: {}, new: undefined }, action) => {
  let newState = {...state}
  switch(action.type) {
    case RECEIVE_EVENTS:
      return { ...state, all: action.events, new: undefined};
    case RECEIVE_USER_EVENTS:
      return { ...state, user: action.events, new: undefined};
    case RECEIVE_NEW_EVENT:
      return { ...state, new: action.event};
    case RECEIVE_USER_LOGOUT:
      return { ...state, user: {}, new: undefined }
    case REMOVE_EVENT:
      delete newState[action.eventId]
      return newState
    case ATTEND_EVENT:
      return {
        ...state,
        user: action.eventId
      };
    case UNATTEND_EVENT:
      return {
        ...state, 
        user: delete action.eventId
      }
    default:
      return state;
  }
};

export default eventsReducer;
import { combineReducers } from 'redux';
import { sessionErrorsReducer } from './session';
import { EventErrorsReducer } from './events';


export default combineReducers({
  session: sessionErrorsReducer,
  event: EventErrorsReducer
});
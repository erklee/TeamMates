// store/store.js

import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import {thunk} from 'redux-thunk';
import session from './session';
import errors from "./errors";
import modals from './modals';
import events from './events'

const rootReducer = combineReducers({
  session, 
  errors,
  modals,
  events
});

let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};



export default configureStore;
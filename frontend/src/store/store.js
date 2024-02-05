// store/store.js

import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import {thunk} from 'redux-thunk';
import session from './session';
import errors from "./errors";
import modals from './modals';
import events from './events'
import users from './users'
import friends from './friends'
import { persistStore, persistReducer } from 'redux-persist'; // Import persistStore and persistReducer
import storage from 'redux-persist/lib/storage'; // Import default storage



const rootReducer = combineReducers({
  session, 
  errors,
  modals,
  events,
  users,
  friends
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['session', 'friends'] // Specify which reducers you want to store
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

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
  const store = createStore(persistedReducer, preloadedState, enhancer);
  const persistor = persistStore(store); // Persist the store
  return { store, persistor };
};



export default configureStore;
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import './index.css';
import configureStore from './store/store';
import * as sessionActions from './store/session'
import * as modalActions from './store/modals'

const store = configureStore();

if (import.meta.env.MODE !== 'production') {
  window.store = store;
  window.sessionActions = sessionActions;
  window.modalActions = modalActions;

}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
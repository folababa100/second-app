import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from "react-redux";
import configureStore from './store/configureStore';
// import App from './components/App';
import './styles/index.css';
import AppRouter from './router/routes'
import registerServiceWorker from './registerServiceWorker';

const store = configureStore();

hydrate(
  <Provider store={store}>
    <AppRouter/>
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker();

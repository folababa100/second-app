import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import filterReducer from '../reducers/filter';
import listsReducer from '../reducers/lists';
import thunk from 'redux-thunk';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {
  const store = createStore(
    combineReducers({
      filter: filterReducer,
      lists: listsReducer
    }),
    composeEnhancers(applyMiddleware(thunk))
  );

  return store;
};

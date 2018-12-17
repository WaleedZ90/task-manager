// src/js/store/index.js
import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from '../reducers/index';
import ajaxMW from '../../middlewares/ajax';
import promise from 'redux-promise';
const store = createStore(
	rootReducer,
	compose(
		applyMiddleware(ajaxMW, promise),
		window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : (f) => f
	)
);
export default store;

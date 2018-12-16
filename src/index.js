import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
// Sass variables + global styles
import './styles/index.scss';
import 'bootstrap/dist/css/bootstrap.css';
import MainLayout from './containers/MainLayout';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<MainLayout />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import ReactGA from 'react-ga';

ReactGA.initialize('UA-126411028-1');

function fireTracking() {
	ReactGA.pageview(window.locaion);
}

ReactDOM.render(
	<BrowserRouter onUpdate={fireTracking}>
		<App />
	</BrowserRouter>,
	document.getElementById('root'));

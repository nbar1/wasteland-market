import React, { Component } from 'react';
import './App.css';
import Header from './components/Header';
import Navigation from './components/Navigation';
import { Switch, Route } from 'react-router-dom';

import Home from './components/Home';

class App extends Component {
	render() {
		return (
			<div className="App">
				<Header />
				<Navigation />
				<Switch>
					<Route exact path='/' component={Home} />
				</Switch>
			</div>
		);
	}
}

export default App;

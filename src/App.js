import React, { Component } from 'react';
import './App.css';
import Header from './components/Header';
import Navigation from './components/Navigation';
import ContentWrapper from './components/ContentWrapper';
import { Switch, Route } from 'react-router-dom';

import Home from './components/Home';
import Login from './components/Login';

import Item from './components/Item';
import NotFound from './components/NotFound';

class App extends Component {
	render() {
		return (
			<div className="App">
				<Header />
				<Navigation />
				<ContentWrapper>
					<Switch>
						<Route exact path='/' component={Home} />
						<Route path='/login' component={Login} />


						<Route path='/item/:item' component={Item} />
						<Route path='/item/:item' component={Item} />

						<Route path="*" component={NotFound} />
					</Switch>
				</ContentWrapper>
			</div>
		);
	}
}

export default App;

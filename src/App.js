import React, { Component } from 'react';
import AuthProvider from './context/AuthProvider';
import './App.css';
import Header from './components/Header';
import Navigation from './components/Navigation';
import ContentWrapper from './components/ContentWrapper';
import { Switch, Route } from 'react-router-dom';

import Home from './components/Home';
import Login from './components/Login';
import Profile from './components/Profile';
import Account from './components/Account';

import Item from './components/Item';
import CreateItem from './components/CreateItem';

import NotFound from './components/NotFound';

class App extends Component {
	render() {
		return (
			<div className="App">
				<AuthProvider>
					<Header />
					<Navigation />
					<ContentWrapper>
						<Switch>
							<Route exact path="/" component={Home} />
							<Route path="/login" component={Login} />
							<Route path="/profile" component={Profile} />
							<Route path="/account" component={Account} />

							<Route path="/item/:item" component={Item} />
							<Route path="/create-item" component={CreateItem} />

							<Route path="*" component={NotFound} />
						</Switch>
					</ContentWrapper>
				</AuthProvider>
			</div>
		);
	}
}

export default App;

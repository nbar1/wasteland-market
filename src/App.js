import React, { Component } from 'react';
import Helmet from 'react-helmet';
import AuthProvider from './context/AuthProvider';
import './App.css';
import Header from './components/Header';
import Navigation from './components/Navigation';
import ContentWrapper from './components/ContentWrapper';
import { Switch, Route } from 'react-router-dom';

import Home from './components/Home';
import Login from './components/Login';
import Profile from './components/Account/Profile';
import Account from './components/Account';

import Market from './components/Market';
import Order from './components/Market/Order';
import CreateItem from './components/Item/CreateItem';

import NotFound from './components/NotFound';

class App extends Component {
	render() {
		return (
			<div className="App">
				<AuthProvider>
					<Helmet>
						<title>Wasteland Market</title>
					</Helmet>
					<Header />
					<Navigation />
					<ContentWrapper>
						<Switch>
							<Route exact path="/" component={Home} />
							<Route path="/login" component={Login} />
							<Route path="/register" component={Login} />
							<Route path="/profile" component={Profile} />
							<Route path="/account" component={Account} />

							<Route path="/order" component={Order} />
							<Route path="/market" component={Market} />
							<Route path="/market/:item" component={Market} />
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

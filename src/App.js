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
import OrderMock from './components/Market/Order/Mock';
import OrderSuccess from './components/Market/Order/OrderSuccess';
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
							<Route exact path="/login" component={Login} />
							<Route exact path="/register" component={Login} />
							<Route exact path="/profile" component={Profile} />
							<Route exact path="/account" component={Account} />

							<Route exact path="/order" component={Order} />
							<Route exact path="/order/mock" component={OrderMock} />
							<Route exact path="/order/success" component={OrderSuccess} />
							<Route exact path="/market" component={Market} />
							<Route exact path="/market/:item" component={Market} />
							<Route exact path="/create-item" component={CreateItem} />

							<Route path="*" component={NotFound} />
						</Switch>
					</ContentWrapper>
				</AuthProvider>
			</div>
		);
	}
}

export default App;

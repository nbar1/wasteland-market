import React, { Component } from 'react';
import Helmet from 'react-helmet';
import AuthProvider from './context/AuthProvider';
import Header from './components/Header';
import ContentWrapper from './components/ContentWrapper';
import { Switch, Route } from 'react-router-dom';
import ReactGA from 'react-ga';

import RequiresLogin from './components/Wrappers/RequireLogin';

import Home from './components/Home';
import Login from './components/Login';
import Profile from './components/Account/Profile';
import AccountVerify from './components/Account/Verify';
import Account from './components/Account';

import Market from './components/Market';
import Order from './components/Market/Order';
import OrderMock from './components/Market/Order/Mock';
import OrderSuccess from './components/Market/Order/OrderSuccess';
import CreateItem from './components/Item/CreateItem';

import NotFound from './components/NotFound';

ReactGA.initialize('UA-126411028-1');

const fireTracking = function() {
	ReactGA.set({ page: window.location.pathname });
	ReactGA.pageview(window.location.pathname);
	return null;
};

class App extends Component {
	render() {
		return (
			<div className="App">
				<Route path="/" component={fireTracking} />
				<AuthProvider>
					<Helmet>
						<title>Wasteland Market</title>
					</Helmet>
					<Header />
					<ContentWrapper>
						<Switch>
							<Route exact path="/" component={Home} />
							<Route exact path="/login" component={Login} />
							<Route exact path="/register" component={Login} />
							<Route exact path="/profile" component={RequiresLogin(Profile)} />
							<Route exact path="/account" component={RequiresLogin(Account)} />
							<Route exact path="/account/verify/:token" component={AccountVerify} />

							<Route exact path="/order" component={RequiresLogin(Order)} />
							<Route exact path="/order/mock" component={RequiresLogin(OrderMock)} />
							<Route exact path="/order/success" component={RequiresLogin(OrderSuccess)} />
							<Route exact path="/market" component={Market} />
							<Route exact path="/market/:item" component={Market} />
							<Route exact path="/create-item" component={RequiresLogin(CreateItem)} />

							<Route path="*" component={NotFound} />
						</Switch>
					</ContentWrapper>
				</AuthProvider>
			</div>
		);
	}
}

export default App;

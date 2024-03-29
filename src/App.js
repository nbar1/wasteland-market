import React, { Component } from 'react';
import Helmet from 'react-helmet';
import AuthProvider from './context/AuthProvider';
import Header from './components/Header';
import ContentWrapper from './components/ContentWrapper';
import { Switch, Route } from 'react-router-dom';
import ReactGA from 'react-ga';

import RequiresLogin from './components/Wrappers/RequireLogin';
import RequiresAdmin from './components/Wrappers/RequireAdmin';

import Home from './components/Home';
import Footer from './components/Footer';
import Login from './components/Login';
import Profile from './components/Account/Profile';
import AccountVerify from './components/Account/Verify';
import ResetPassword from './components/Account/ResetPassword';
import ResetPasswordEntry from './components/Account/ResetPassword/Entry';
import Account from './components/Account';

import Market from './components/Market';
import MarketDirectory from './components/Market/Directory';
import Order from './components/Market/Order';
import CreateItem from './components/Item/CreateItem';

import MyOrders from './components/Market/Orders/MyOrders';

import UserProfile from './components/User/Profile';

import PrivacyPolicy from './components/Static/PrivacyPolicy';
import TermsOfService from './components/Static/TermsOfService';
import FAQ from './components/Static/FAQ';

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
				<AuthProvider>
					<Helmet>
						<title>Wasteland Market - Fallout 76 Marketplace</title>
					</Helmet>
					<Route path="/" component={fireTracking} />
					<Header />
					<ContentWrapper>
						<Switch>
							<Route exact path="/" component={Home} />
							<Route exact path="/login" component={Login} />
							<Route exact path="/register" component={Login} />
							<Route exact path="/profile" component={RequiresLogin(Profile)} />
							<Route exact path="/account" component={RequiresLogin(Account)} />
							<Route exact path="/account/verify/:token" component={AccountVerify} />
							<Route exact path="/account/reset-password" component={ResetPassword} />
							<Route exact path="/account/reset-password/:token" component={ResetPasswordEntry} />

							<Route exact path="/order" component={RequiresLogin(Order)} />
							<Route exact path="/market" component={MarketDirectory} />
							<Route exact path="/market/:item" component={Market} />
							<Route exact path="/my-orders" component={RequiresLogin(MyOrders)} />

							<Route exact path="/user/:username" component={UserProfile} />

							<Route exact path="/create-item" component={RequiresAdmin(CreateItem)} />

							<Route exact path="/privacy-policy" component={PrivacyPolicy} />
							<Route exact path="/terms-of-service" component={TermsOfService} />
							<Route exact path="/faq" component={FAQ} />

							<Route path="*" component={NotFound} />
						</Switch>
					</ContentWrapper>
					<Footer />
				</AuthProvider>
			</div>
		);
	}
}

export default App;

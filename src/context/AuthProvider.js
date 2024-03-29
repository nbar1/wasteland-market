import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AuthContext from './AuthContext';
import axios from 'axios';

class AuthProvider extends Component {
	login = user => {
		this.setState({
			isLoggedIn: true,
			isAdmin: false,
			username: user.username,
			id: user.id,
			premium: user.premium,
			verified: user.verified,
			platforms: user.platforms,
		});
	};

	logout = () => {
		this.setState({
			isLoggedIn: false,
			isAdmin: false,
			username: null,
			id: null,
			premium: false,
			verified: false,
			platforms: {},
		});
	};

	state = {
		isLoggedIn: false,
		isAdmin: false,
		isCurrent: false,
		username: null,
		id: null,
		premium: false,
		platforms: {},
		login: this.login,
		logout: this.logout,
	};

	componentDidMount = () => {
		if (this.state.isLoggedIn !== false) return;

		axios
			.get('/api/user/authStatus')
			.then(res => {
				this.setState({
					isCurrent: true,
					isLoggedIn: true,
					isAdmin: res.data.admin,
					username: res.data.username,
					id: res.data.id,
					premium: res.data.premium,
					verified: res.data.verified,
					platforms: res.data.platforms,
				});
			})
			.catch(err => {
				this.setState({
					isCurrent: true,
					isLoggedIn: false,
					username: null,
					id: null,
					premium: false,
					verified: false,
					platforms: {},
				});
			});
	};

	render() {
		return <AuthContext.Provider value={this.state}>{this.props.children}</AuthContext.Provider>;
	}
}

AuthProvider.propTypes = {
	children: PropTypes.array,
};

export default AuthProvider;

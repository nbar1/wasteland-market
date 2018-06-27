import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AuthContext from './AuthContext';
import axios from 'axios';

class AuthProvider extends Component {
	login = user => {
		this.setState({
			isLoggedIn: true,
			username: user.username,
			premium: user.premium,
			platforms: user.platforms,
		});
	}

	logout = () => {
		this.setState({
			isLoggedIn: false,
			username: null,
			premium: false,
			platforms: {},
		});
	}

	state = {
		isLoggedIn: false,
		isCurrent: false,
		username: null,
		premium: false,
		platforms: {},
		login: this.login,
		logout: this.logout,
	}

	componentDidMount = () => {
		if (this.state.isLoggedIn !== false) return;

		axios.get('/user/authStatus')
			.then(res => {
				this.setState({
					isCurrent: true,
					isLoggedIn: true,
					username: res.data.username,
					premium: res.data.premium,
					platforms: res.data.platforms,
				});
			})
			.catch(err => {
				this.setState({
					isCurrent: true,
					isLoggedIn: false,
					username: null,
					premium: false,
					platforms: {},
				});
			});
	}

	render() {
		return (
			<AuthContext.Provider value={this.state}>
				{this.props.children}
			</AuthContext.Provider>
		);
	}
}

AuthProvider.propTypes = {
	children: PropTypes.array,
};

export default AuthProvider;

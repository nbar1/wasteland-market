import React, { Component } from 'react';
import AuthContext from './AuthContext';
import axios from 'axios';

class AuthProvider extends Component {
	login = user => {
		this.setState({
			isLoggedIn: true,
			username: user.username,
			premium: user.premium,
		});
	}

	logout = () => {
		this.setState({
			isLoggedIn: false,
			username: null,
			premium: false,
		});
	}

	state = {
		isLoggedIn: false,
		isCurrent: false,
		username: null,
		premium: false,
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
				});
			})
			.catch(err => {
				this.setState({
					isCurrent: true,
					isLoggedIn: false,
					username: null,
					premium: false,
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

export default AuthProvider;

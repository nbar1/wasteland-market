import React, { Component } from 'react';
import Helmet from 'react-helmet';
import axios from 'axios';

import ProfileInformation from './Information';

/**
 * UserProfile
 *
 * @extends Component
 */
class UserProfile extends Component {
	/**
	 * state
	 *
	 * @type {obj}
	 */
	state = {
		userData: {},
	};

	/**
	 * getUserData
	 *
	 * @returns {void}
	 */
	getUserData() {
		axios
			.get(`/api/user/profile?username=${this.props.match.params.username}`)
			.then(res => {
				this.setState({
					userData: res.data.user,
				});
			})
			.catch(err => {
				this.setState({ error: true });
			});
	}

	/**
	 * componentDidMount
	 *
	 * @returns {void}
	 */
	componentDidMount() {
		this.getUserData();
	}

	/**
	 * render
	 *
	 * @returns {jsx}
	 */
	render() {
		return (
			<div>
				<Helmet>
					<title>
						Wasteland Market - {this.props.match.params.username}
						's Profile
					</title>
				</Helmet>
				<ProfileInformation username={this.props.match.params.username} userData={this.state.userData} />
			</div>
		);
	}
}

export default UserProfile;

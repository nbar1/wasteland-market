import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Typography } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import Loading from '../../Loading';
import AuthContext from '../../../context/AuthContext';
import Platforms from './Platforms';

class Profile extends Component {
	render() {
		return (
			<AuthContext>
				{context => (
					<div>
						{context.isCurrent === false ? (
							<Loading fullPage={true} />
						) : context.isLoggedIn === false ? (
							<Redirect to="/login" />
						) : (
							<div>
								<Helmet>
									<title>Wasteland Market - Profile</title>
								</Helmet>
								<Typography gutterBottom variant="headline" component="h1">
									Profile
								</Typography>
								<Platforms {...context} />
							</div>
						)}
					</div>
				)}
			</AuthContext>
		);
	}
}

export default Profile;

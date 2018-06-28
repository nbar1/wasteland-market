import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Typography } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import Loading from '../Loading';
import AuthContext from '../../context/AuthContext';
import ChangePassword from './ChangePassword';
import ChangeEmail from './ChangeEmail';

class Account extends Component {
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
									<title>Wasteland Market - My Account</title>
								</Helmet>
								<Typography gutterBottom variant="headline" component="h1">
									My Account
								</Typography>
								<ChangeEmail />
								<br />
								<ChangePassword />
							</div>
						)}
					</div>
				)}
			</AuthContext>
		);
	}
}

export default Account;

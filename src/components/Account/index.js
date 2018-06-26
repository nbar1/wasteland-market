import React, { Component } from 'react';
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
								<Typography gutterBottom variant="headline" component="h1">
									Account
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

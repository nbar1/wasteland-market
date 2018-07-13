import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Typography } from '@material-ui/core';
import ChangePassword from './ChangePassword';
import ChangeEmail from './ChangeEmail';

class Account extends Component {
	render() {
		return (
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
		);
	}
}

export default Account;

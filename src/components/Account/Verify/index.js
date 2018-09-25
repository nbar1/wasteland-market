import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Typography, CardContent } from '@material-ui/core';
import Helmet from 'react-helmet';
import axios from 'axios';
import ReactGA from 'react-ga';

class Verify extends Component {
	constructor(props) {
		super();

		this.state = {
			isVerified: false,
			error: false,
		};

		this.getVerification(props.match.params.token);
	}

	getVerification = token => {
		axios
			.get(`/api/user/verify/${token}`)
			.then(res => {
				this.setState({ isVerified: true });

				ReactGA.event({
					category: 'User',
					action: 'Verified Email'
				});
			})
			.catch(err => {
				this.setState({ error: true });
			});
	};

	render() {
		return (
			<div>
				<Helmet>
					<title>Wasteland Market - Verify Account</title>
				</Helmet>

				<Card raised={true}>
					<CardContent>
						<Typography gutterBottom variant="headline" component="h2">
							Verify Account
						</Typography>
						{!this.state.isVerified && !this.state.error && <div>Please Wait...</div>}
						{!this.state.isVerified && this.state.error && <div>We were unable to verify your account</div>}
						{this.state.isVerified && !this.state.error && <div>Your account is now verified!</div>}
					</CardContent>
				</Card>
			</div>
		);
	}
}

export default withRouter(Verify);

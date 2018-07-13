import React, { Component } from 'react';
import styled from 'styled-components';
import { Card, Typography, CardContent, Button } from '@material-ui/core';
import axios from 'axios';

const ButtonWrapper = styled.div`
	margin: 35px auto 10px;
`;

const StyledButton = styled(Button)`
	&& {
		background: #2a2a2a;
		color: rgb(220, 182, 38);

		&:hover {
			background: #2a2a2a;
		}
	}
`;

const GeneralError = styled.div`
	color: #f44336;
`;

const SuccessMessage = styled.div`
	color: #007700;
`;

class VerificationStatus extends Component {
	state = {
		generalError: false,
		successMessage: false,
	};

	resend = () => {
		axios
			.get('/api/user/verify/resend')
			.then(res => {
				if (res.data.tokenCreated === true) {
					this.setState({
						successMessage: 'A verification email has been sent',
					});
				}
			})
			.catch((err, res) => {
				this.setState({
					generalError: 'There was an error creating a verification token',
				});
			});
	};

	render() {
		return (
			<div>
				<Card raised>
					<CardContent>
						<Typography gutterBottom variant="headline" component="h2">
							Your Account Is Not Verified
						</Typography>

						<ButtonWrapper>
							<StyledButton variant="contained" size="large" onClick={this.resend}>
								Resend Verification Email
							</StyledButton>
						</ButtonWrapper>

						{this.state.generalError && <GeneralError>{this.state.generalError}</GeneralError>}
						{this.state.successMessage && <SuccessMessage>{this.state.successMessage}</SuccessMessage>}
					</CardContent>
				</Card>
			</div>
		);
	}
}

export default VerificationStatus;

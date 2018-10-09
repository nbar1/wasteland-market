import React, { Component } from 'react';
import styled from 'styled-components';
import { Card, Typography, CardContent, Button } from '@material-ui/core';
import axios from 'axios';

import UserRating from './Rating';

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

const RatingText = styled.div`

`;

class ProfileInformation extends Component {
	state = {
		generalError: false,
		successMessage: false,
	};

	render() {
		return (
			<div>
				<Card raised>
					<CardContent>
						<Typography gutterBottom variant="headline" component="h1">
							{this.props.username}
						</Typography>
						<RatingText>User Rating: <span>{this.props.userData.rating}</span></RatingText>

						<UserRating userId={this.props.userData.id} />

						{this.state.generalError && <GeneralError>{this.state.generalError}</GeneralError>}
						{this.state.successMessage && <SuccessMessage>{this.state.successMessage}</SuccessMessage>}
					</CardContent>
				</Card>
			</div>
		);
	}
}

export default ProfileInformation;

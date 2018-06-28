import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Card, Typography, CardContent, TextField, Button } from '@material-ui/core';
import axios from 'axios';
import qs from 'querystring';

const StyledTextField = styled(TextField)`
	&& {
		display: block;
		margin: 20px 0 20px 30px;
		position: relative;
		text-align: center;
		width: 300px;

		&:before {
			font-family: 'Font Awesome 5 Brands';
			font-size: 20px;
			position: absolute;
			margin-left: -30px;
			margin-top: 20px;
		}

		&.discord:before {
			color: #7289da;
			content: '\f392';
		}

		&.xbox:before {
			color: #107c11;
			content: '\f412';
		}

		&.playstation:before {
			color: #0072ce;
			content: '\f3df';
		}

		&.steam:before {
			color: #171a21;
			content: '\f1b6';
		}
	}
`;

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

const HiddenSubmit = styled.input`
	height: 0;
	visibility: hidden;
	width: 0;
`;

class Platforms extends Component {
	constructor(props) {
		super();

		this.state = {
			xbox: '',
			playstation: '',
			steam: '',
			discord: '',
			generalError: '',
			successMessage: '',
		};

		if (props.platforms) {
			this.state.xbox = props.platforms.xbox;
			this.state.playstation = props.platforms.playstation;
			this.state.steam = props.platforms.steam;
			this.state.discord = props.platforms.discord;
		}
	}

	onChange = event => {
		this.setState({
			[event.target.name]: event.target.value,
		});
	};

	submitForm = event => {
		if (event) event.preventDefault();

		// Register
		axios
			.post(
				'/api/user/update-platforms',
				qs.stringify({
					xbox: this.state.xbox,
					playstation: this.state.playstation,
					steam: this.state.steam,
					discord: this.state.discord,
				})
			)
			.then(res => {
				if (res.data.success === true) {
					this.setState({
						successMessage: res.data.message,
					});
				}
			})
			.catch(err => {
				let errorMessage = err.response && err.response.data ? err.response.data.message : 'Unknown Error';
				this.setState({
					generalError: errorMessage,
				});
			});
	};

	render() {
		return (
			<div>
				<Card>
					<CardContent>
						<Typography gutterBottom variant="headline" component="h2">
							Platforms
						</Typography>
						<form onSubmit={this.submitForm}>
							{this.state.generalError && <GeneralError>{this.state.generalError}</GeneralError>}
							{this.state.successMessage && <SuccessMessage>{this.state.successMessage}</SuccessMessage>}

							<StyledTextField
								type="text"
								id="xbox"
								name="xbox"
								label="Xbox Gamertag"
								className="xbox"
								margin="normal"
								fullWidth={true}
								value={this.state.xbox}
								onChange={this.onChange}
							/>

							<StyledTextField
								type="text"
								id="playstation"
								name="playstation"
								label="PSN Name"
								className="playstation"
								margin="normal"
								fullWidth={true}
								value={this.state.playstation}
								onChange={this.onChange}
							/>

							<StyledTextField
								type="text"
								id="discord"
								name="discord"
								label="Discord"
								className="discord"
								margin="normal"
								fullWidth={true}
								value={this.state.discord}
								onChange={this.onChange}
							/>

							<StyledTextField
								type="text"
								id="steam"
								name="steam"
								label="Steam ID"
								className="steam"
								margin="normal"
								fullWidth={true}
								value={this.state.steam}
								onChange={this.onChange}
							/>

							<HiddenSubmit type="submit" />

							<ButtonWrapper>
								<StyledButton variant="contained" size="large" onClick={this.submitForm}>
									Update Platforms
								</StyledButton>
							</ButtonWrapper>
						</form>
					</CardContent>
				</Card>
			</div>
		);
	}
}

Platforms.propTypes = {
	platforms: PropTypes.object,
};

export default Platforms;

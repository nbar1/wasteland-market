import React, { Component } from 'react';
import styled from 'styled-components';
import { Card, Typography, CardContent, TextField, Button } from '@material-ui/core';
import axios from 'axios';
import qs from 'querystring';

const StyledTextField = styled(TextField)`
	&& {
		display: block;
		text-align: center;
		width: 300px;
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

class ChangeEmail extends Component {
	state = {
		email: '',
		generalError: '',
		successMessage: false,
		missingEmail: false,
	};

	onChange = event => {
		this.setState({
			[event.target.name]: event.target.value,
		});

		this.resetValidation();
	};

	validateForm = () => {
		let returnVal = true;

		this.setState({ generalError: '', successMessage: '' });

		if (this.state.email === '') {
			this.setState({ missingEmail: true });
			returnVal = false;
		}

		return returnVal;
	};

	resetValidation = () => {
		this.setState({
			missingEmail: false,
		});
	};

	clearForm() {
		this.setState({
			email: '',
		});
	}

	submitForm = event => {
		if (event) event.preventDefault();
		if (this.validateForm() === false) return;

		// Register
		axios
			.post(
				'/user/change-email',
				qs.stringify({
					email: this.state.email,
				})
			)
			.then(res => {
				if (res.data.success === true) {
					this.setState({
						successMessage: res.data.message,
					});
				}
			})
			.catch((err, res) => {
				let errorMessage =
					err.response && err.response.data ? err.response.data.message : 'Unknown Error';
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
							Change Email Address
						</Typography>
						<form onSubmit={this.submitForm}>
							{this.state.generalError && (
								<GeneralError>{this.state.generalError}</GeneralError>
							)}
							{this.state.successMessage && (
								<SuccessMessage>{this.state.successMessage}</SuccessMessage>
							)}

							<StyledTextField
								type="text"
								required
								id="email"
								name="email"
								label="Email Address"
								margin="normal"
								fullWidth={true}
								value={this.state.email}
								onChange={this.onChange}
								error={this.state.missingEmail ? true : false}
								helperText={
									this.state.missingNewPassword
										? 'Please enter an email'
										: false
								}
							/>

							<HiddenSubmit type="submit" />

							<ButtonWrapper>
								<StyledButton
									variant="contained"
									size="large"
									onClick={this.submitForm}
								>
									Change Email Address
								</StyledButton>
							</ButtonWrapper>
						</form>
					</CardContent>
				</Card>
			</div>
		);
	}
}

export default ChangeEmail;

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

class ChangePassword extends Component {
	state = {
		currentPassword: '',
		newPassword: '',
		newPasswordConf: '',
		generalError: '',
		successMessage: false,
		missingOldPassword: false,
		missingNewPassword: false,
		missingNewPasswordConf: false,
		passwordMismatch: false,
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

		if (this.state.currentPassword === '') {
			this.setState({ missingCurrentPassword: true });
			returnVal = false;
		}

		if (this.state.newPassword === '') {
			this.setState({ missingNewPassword: true });
			returnVal = false;
		}

		if (this.state.newPasswordConf === '') {
			this.setState({ missingNewPasswordConf: true });
			returnVal = false;
		}

		if (
			this.state.currentPassword !== '' &&
			this.state.newPasswordConf !== '' &&
			this.state.newPassword !== this.state.newPasswordConf
		) {
			this.setState({ passwordMismatch: true });
			returnVal = false;
		}

		return returnVal;
	};

	resetValidation = () => {
		this.setState({
			missingCurrentPassword: false,
			missingNewPassword: false,
			missingNewPasswordConf: false,
			passwordMismatch: false,
		});
	};

	clearForm() {
		this.setState({
			currentPassword: '',
			newPassword: '',
			newPasswordConf: '',
		});
	}

	submitForm = event => {
		if (event) event.preventDefault();
		if (this.validateForm() === false) return;

		// Register
		axios
			.post(
				'/user/change-password',
				qs.stringify({
					currentPassword: this.state.currentPassword,
					newPassword: this.state.newPassword,
					newPasswordConf: this.state.newPasswordConf,
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
							Change Password
						</Typography>
						<form onSubmit={this.submitForm}>
							{this.state.generalError && (
								<GeneralError>{this.state.generalError}</GeneralError>
							)}
							{this.state.successMessage && (
								<SuccessMessage>{this.state.successMessage}</SuccessMessage>
							)}

							<StyledTextField
								type="password"
								required
								id="currentPassword"
								name="currentPassword"
								label="Current Password"
								margin="normal"
								fullWidth={true}
								value={this.state.currentPassword}
								onChange={this.onChange}
								error={this.state.missingCurrentPassword ? true : false}
								helperText={
									this.state.missingNewPassword
										? 'Please enter a password'
										: false
								}
							/>

							<StyledTextField
								type="password"
								required
								id="newPassword"
								name="newPassword"
								label="New Password"
								margin="normal"
								fullWidth={true}
								value={this.state.newPassword}
								onChange={this.onChange}
								error={
									this.state.missingNewPassword || this.state.passwordMismatch
										? true
										: false
								}
								helperText={
									this.state.missingNewPassword
										? 'Please enter a new password'
										: false
								}
							/>

							<StyledTextField
								type="password"
								required
								id="newPasswordConf"
								name="newPasswordConf"
								label="Confirm New Password"
								margin="normal"
								fullWidth={true}
								value={this.state.newPasswordConf}
								onChange={this.onChange}
								error={
									this.state.missingNewPasswordConf || this.state.passwordMismatch
										? true
										: false
								}
								helperText={
									this.state.missingNewPasswordConf
										? 'Please confirm your new password'
										: false
								}
							/>

							{this.state.passwordMismatch && (
								<GeneralError>Your updated passwords do not match</GeneralError>
							)}

							<HiddenSubmit type="submit" />

							<ButtonWrapper>
								<StyledButton
									variant="contained"
									size="large"
									onClick={this.submitForm}
								>
									Change Password
								</StyledButton>
							</ButtonWrapper>
						</form>
					</CardContent>
				</Card>
			</div>
		);
	}
}

export default ChangePassword;

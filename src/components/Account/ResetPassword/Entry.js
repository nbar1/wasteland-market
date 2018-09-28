import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { TextField, Button, Card, CardContent, Typography } from '@material-ui/core';
import styled from 'styled-components';
import axios from 'axios';
import qs from 'querystring';
import ReactGA from 'react-ga';

const StyledCard = styled(Card)`
	background-color: #ddd;
	border-radius: 3px;
	box-shadow: 0 0 5px 2px rgba(220, 182, 38, 0.5);
	margin: 25px auto 0;
	padding: 25px 10px;
	max-width: 400px;
	text-align: center;
`;

const StyledTextField = styled(TextField)`
	&& {
		display: block;
		margin: 20px auto 0;
		text-align: center;
		width: 300px;
	}
`;

const ButtonWrapper = styled.div`
	margin: 35px auto 10px;
	width: 300px;
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
	margin: 10px 0;
`;

const SuccessMessage = styled.div`
	color: green;
	margin: 10px 0;
`;

const HiddenSubmit = styled.input`
	height: 0;
	visibility: hidden;
	width: 0;
`;

class ResetPasswordEntry extends Component {
	/**
	 * state
	 *
	 * @type {object}
	 */
	state = {
		password: '',
		passwordConf: '',
		generalError: '',
		successMessage: '',
		missingPassword: false,
		missingPasswordConf: false,
	};

	/**
	 * onChange
	 *
	 * @param {object} event
	 * @returns {void}
	 */
	onChange = event => {
		this.setState({
			[event.target.name]: event.target.value,
		});

		this.resetValidation();
	};

	/**
	 * validateForm
	 *
	 * @returns {bool}
	 */
	validateForm = () => {
		let returnVal = true;

		this.setState({
			generalError: '',
			successMessage: '',
		});

		if (this.state.password === '') {
			this.setState({ missingPassword: true });
			returnVal = false;
		}

		if (this.state.passwordConf === '') {
			this.setState({ missingPasswordConf: true });
			returnVal = false;
		}

		if (
			this.state.password !== '' &&
			this.state.passwordConf !== '' &&
			this.state.password !== this.state.passwordConf
		) {
			this.setState({ passwordMismatch: true });
			returnVal = false;
		}

		return returnVal;
	};

	/**
	 * resetValidation
	 *
	 * @returns {void}
	 */
	resetValidation = () => {
		this.setState({
			missingPassword: false,
			missingPasswordConf: false,
		});
	};

	/**
	 * submitForm
	 *
	 * @param {object} event
	 * @returns {void}
	 */
	submitForm = event => {
		if (event) event.preventDefault();
		if (this.validateForm() === false) return;

		axios
			.post(
				`/api/user/reset-password/${this.props.match.params.token}`,
				qs.stringify({
					newPassword: this.state.password,
					newPasswordConf: this.state.passwordConf,
				})
			)
			.then(res => {
				this.setState({
					successMessage: 'Your password has been reset',
				});

				ReactGA.event({
					category: 'User',
					action: 'Reset Password - Entry',
				});
			})
			.catch((err, res) => {
				let errorMessage = err.response && err.response.data ? err.response.data.message : 'Unknown Error';
				this.setState({
					generalError: errorMessage,
				});
			});
	};

	/**
	 * render
	 *
	 * @returns {jsx}
	 */
	render() {
		return (
			<div>
				<Helmet>
					<title>Wasteland Market - Reset Password</title>
				</Helmet>
				<StyledCard raised={true}>
					<form onSubmit={this.submitForm}>
						<CardContent>
							<Typography gutterBottom variant="headline" component="h2">
								Reset Password
							</Typography>

							{this.state.successMessage && <SuccessMessage>{this.state.successMessage}</SuccessMessage>}
							{this.state.generalError && <GeneralError>{this.state.generalError}</GeneralError>}

							<StyledTextField
								type="password"
								required
								id="password"
								name="password"
								label="Password"
								margin="normal"
								fullWidth={true}
								value={this.state.password}
								onChange={this.onChange}
								error={this.state.missingPassword || this.state.passwordMismatch ? true : false}
								helperText={this.state.missingPassword ? 'Please enter a password' : false}
							/>

							{!this.state.isLogin && (
								<StyledTextField
									type="password"
									required
									id="passwordConf"
									name="passwordConf"
									label="Confirm Password"
									margin="normal"
									fullWidth={true}
									value={this.state.passwordConf}
									onChange={this.onChange}
									error={this.state.missingPasswordConf || this.state.passwordMismatch ? true : false}
									helperText={this.state.missingPasswordConf ? 'Please confirm your password' : false}
								/>
							)}

							{this.state.passwordMismatch &&
								!this.state.isLogin && <GeneralError>Your passwords do not match</GeneralError>}

							<HiddenSubmit type="submit" />

							<ButtonWrapper>
								<StyledButton variant="contained" size="large" onClick={this.submitForm}>
									Reset Password
								</StyledButton>
							</ButtonWrapper>
						</CardContent>
					</form>
				</StyledCard>
			</div>
		);
	}
}

export default ResetPasswordEntry;

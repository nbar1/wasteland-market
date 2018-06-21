import React, { Component } from 'react';
import { TextField, Button } from '@material-ui/core';
import axios from 'axios';
import qs from 'querystring';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';

const LoginWrapper = styled.div`
	margin: 0 auto;
	padding-top: 10vh;
	text-align: center;
`;

const Title = styled.div`
	margin: 0 auto 5px;
	position: relative;
	text-align: left;
	width: 400px;

	> .header {
		font-size: 32px;
		font-weight: bold;
	}

	> .subheader {
		bottom: 0;
		cursor: pointer;
		position: absolute;
		right: 0;
		text-decoration: underline;
	}
`;

const FormWrapper = styled.form`
	background-color: #ddd;
	border-radius: 3px;
	box-shadow: 0 0 5px 2px rgba(220, 182, 38, 0.5);
	margin: 0 auto;
	padding: 25px 10px;
	max-width: 400px;
	text-align: center;
`;

const StyledTextField = styled(TextField)`
	&& {
		display: block;
		margin-left: 50px;
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
`;

class LoginForm extends Component {
	state = {
		isLogin: true,
		email: '',
		username: '',
		password: '',
		passwordConf: '',
		generalError: '',
		missingEmail: false,
		missingUsername: false,
		missingPassword: false,
		missingPasswordConf: false,
		passwordMismatch: false,
	};

	toggleForm = () => {
		this.setState({
			isLogin: !this.state.isLogin,
		});

		this.resetValidation();
	};

	onChange = event => {
		this.setState({
			[event.target.name]: event.target.value,
		});

		this.resetValidation()
	}

	validateForm = () => {
		let returnVal = true;

		this.setState({ generalError: '' });

		if (this.state.email === '') {
			this.setState({ missingEmail: true });
			returnVal = false;
		}

		if (this.state.password === '') {
			this.setState({ missingPassword: true });
			returnVal = false;
		}

		if (this.state.isLogin) return returnVal;

		if (this.state.username === '') {
			this.setState({ missingUsername: true });
			returnVal = false;
		}

		if (this.state.passwordConf === '') {
			this.setState({ missingPasswordConf: true });
			returnVal = false;
		}

		if (this.state.password !== '' && this.state.passwordConf !== '' && this.state.password !== this.state.passwordConf) {
			this.setState({ passwordMismatch: true });
			returnVal = false;
		}

		return returnVal;
	}

	resetValidation = () => {
		this.setState({
			missingEmail: false,
			missingUsername: false,
			missingPassword: false,
			missingPasswordConf: false,
			passwordMismatch: false,
		})
	}

	submitForm = () => {
		if (this.validateForm() === false) return;

		if (this.state.isLogin === true) {
			// Login
			let formData = new FormData();
			formData.set('email', this.state.email);
			formData.set('password', this.state.password);

			axios.post('/user/login', qs.stringify({
				'email': this.state.email,
				'password': this.state.password,
			}))
				.then(res => {
					this.props.context.login(res.data.user);
				})
				.catch((err, res) => {
					let errorMessage = err.response && err.response.data ? err.response.data.message : 'Unknown Error';
					this.setState({
						generalError: errorMessage,
					});
				});
		}
		else {
			// Register
			let formData = new FormData();
			formData.set('email', this.state.email);
			formData.set('username', this.state.username);
			formData.set('password', this.state.password);
			formData.set('passwordConf', this.state.passwordConf);

			axios.post('/user/register', qs.stringify({
				'email': this.state.email,
				'username': this.state.username,
				'password': this.state.password,
				'passwordConf': this.state.passwordConf,
			}))
				.then(res => {
					console.log(res);
				})
				.catch((err, res) => {
					let errorMessage = err.response && err.response.data ? err.response.data.message : 'Unknown Error';
					this.setState({
						generalError: errorMessage,
					});
				});
		}
	};

	render() {
		if (this.props.context.isLoggedIn === true) {
			return <Redirect to='/' />
		}

		return (
			<LoginWrapper>
				<Title>
					<div className="header">{this.state.isLogin ? 'Login' : 'Register'}</div>
					<div className="subheader" onClick={this.toggleForm}>{this.state.isLogin ? 'Register' : 'Login'}</div>
				</Title>
				<FormWrapper>

					{this.state.generalError &&
						<GeneralError>{this.state.generalError}</GeneralError>
					}

					<StyledTextField
						required
						id="email"
						name="email"
						label="Email Address"
						margin="normal"
						fullWidth={true}
						value={this.state.email}
						onChange={this.onChange}
						error={this.state.missingEmail ? true : false}
						helperText={this.state.missingEmail ? 'Please enter your Email Address' : false}
					/>

					{!this.state.isLogin &&
						<StyledTextField
							required
							id="username"
							name="username"
							label="Username"
							margin="normal"
							fullWidth={true}
							value={this.state.username}
							onChange={this.onChange}
							error={this.state.missingUsername ? true : false}
							helperText={this.state.missingUsername ? 'Please enter your Username' : false}
						/>
					}

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

					{!this.state.isLogin &&
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
					}

					{this.state.passwordMismatch && !this.state.isLogin &&
						<GeneralError>Your passwords do not match</GeneralError>
					}
					<ButtonWrapper>
						<StyledButton
							variant="contained"
							size="large"
							onClick={this.submitForm}>
							{this.state.isLogin ? 'Login' : 'Register'}
						</StyledButton>
					</ButtonWrapper>
				</FormWrapper>
			</LoginWrapper>
		);
	}
}

export default LoginForm;

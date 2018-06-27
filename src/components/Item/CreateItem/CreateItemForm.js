import React, { Component } from 'react';
import { TextField, Button } from '@material-ui/core';
import axios from 'axios';
import qs from 'querystring';
import styled from 'styled-components';

const CreateItemWrapper = styled.div`
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

const HiddenSubmit = styled.input`
	height: 0;
	visibility: hidden;
	width: 0;
`;

const HelpText = styled.div`
	color: #f44336;
	font-size: 12px;
	padding: 0 15px;
	text-align: left;

	> ul {
		padding-right: 40px;
	}
`;

class LoginForm extends Component {
	state = {
		item: '',
		generalError: '',
		missingItem: '',
	};

	onChange = event => {
		this.setState({
			[event.target.name]: event.target.value,
		});

		this.resetValidation();
	};

	validateForm = () => {
		let returnVal = true;

		this.setState({ generalError: '' });

		if (this.state.item === '') {
			this.setState({ missingItem: true });
			returnVal = false;
		}

		return returnVal;
	};

	resetValidation = () => {
		this.setState({
			missingItem: false,
		});
	};

	clearForm() {
		this.setState({
			item: '',
		});
	}

	submitForm = event => {
		if (event) event.preventDefault();
		if (this.validateForm() === false) return;

		let formData = new FormData();
		formData.set('email', this.state.email);
		formData.set('password', this.state.password);

		axios
			.post(
				'/api/item/create',
				qs.stringify({
					item: this.state.item,
				})
			)
			.then(res => {
				console.log(res);
				if (res.data.redirect) {
					this.setState({
						redirect: res.data.redirect,
					});
				}
			})
			.catch((err, res) => {
				let errorMessage =
					err.response && err.response.data
						? err.response.data.message
						: 'Unknown Error';
				this.setState({
					generalError: errorMessage,
				});
			});
	};

	render() {
		return (
			<CreateItemWrapper>
				<Title>
					<div className="header">Add Item</div>
				</Title>
				<FormWrapper onSubmit={this.submitForm}>
					<HelpText>
						During the BETA, an added item will be available on the
						market immediately. We ask that you take extra care to
						ensure that capitalization, punctuation, and format of
						the name is correct and matches what is in the game. We
						thank you for taking part in the Wasteland Market BETA!
						<ul>
							<li>
								Ensure item name matches the in-game item name.
							</li>
							<li>
								Item image and attributes will be added by the
								development team.
							</li>
							<li>
								Abuse of this system will limit your ability to
								use Wasteland Market.
							</li>
						</ul>
					</HelpText>
					{this.state.generalError && (
						<GeneralError>{this.state.generalError}</GeneralError>
					)}

					<StyledTextField
						required
						id="item"
						name="item"
						label="Item Name"
						margin="normal"
						fullWidth={true}
						value={this.state.item}
						onChange={this.onChange}
						error={this.state.missingItem ? true : false}
						helperText={
							this.state.missingItem
								? 'Please enter an item name'
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
							Add Item
						</StyledButton>
					</ButtonWrapper>
				</FormWrapper>
			</CreateItemWrapper>
		);
	}
}

export default LoginForm;

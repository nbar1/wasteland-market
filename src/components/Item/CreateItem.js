import React, { Component } from 'react';
import {
	TextField,
	Button,
	Card,
	CardContent,
	Typography,
	FormControl,
	InputLabel,
	NativeSelect,
} from '@material-ui/core';
import axios from 'axios';
import qs from 'querystring';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';
import Helmet from 'react-helmet';
import ReactGA from 'react-ga';

const StyledCard = styled(Card)`
	margin: 0 auto;
	max-width: 400px;
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

const SelectFormControl = styled(FormControl)`
	&& {
		display: block;
		margin: 20px 0;
		position: relative;
		width: 300px;
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

class CreateItem extends Component {
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
					category: this.state.category,
				})
			)
			.then(res => {
				if (res.data.redirect) {
					this.setState({
						redirect: res.data.redirect,
					});

					ReactGA.event({
						category: 'Item',
						action: 'Create Item',
						label: this.state.item,
					});
				}
			})
			.catch((err, res) => {
				let errorMessage = err.response && err.response.data ? err.response.data.message : 'Unknown Error';
				this.setState({
					generalError: errorMessage,
				});
			});
	};

	render() {
		if (this.state.redirect) {
			return <Redirect to={this.state.redirect} />;
		}

		return (
			<div>
				<Helmet>
					<title>Wasteland Market - Add Item</title>
				</Helmet>
				<StyledCard raised={true}>
					<form onSubmit={this.submitForm}>
						<CardContent>
							<Typography gutterBottom variant="headline" component="h2">
								Add Item
							</Typography>

							<HelpText>
								During the BETA, an added item will be available on the market immediately. We ask that
								you take extra care to ensure that capitalization, punctuation, and format of the name
								is correct and matches what is in the game. We thank you for taking part in the
								Wasteland Market BETA!
								<ul>
									<li>Ensure item name matches the in-game item name.</li>
									<li>Item image and attributes will be added by the development team.</li>
									<li>Abuse of this system will limit your ability to use Wasteland Market.</li>
								</ul>
							</HelpText>
							{this.state.generalError && <GeneralError>{this.state.generalError}</GeneralError>}

							<TextField
								required
								id="item"
								name="item"
								label="Item Name"
								margin="normal"
								autoComplete="off"
								fullWidth={true}
								value={this.state.item}
								onChange={this.onChange}
								error={this.state.missingItem ? true : false}
								helperText={this.state.missingItem ? 'Please enter an item name' : false}
							/>

							<SelectFormControl>
								<InputLabel htmlFor="category">Category</InputLabel>
								<NativeSelect
									value={this.state.category}
									onChange={this.onChange}
									inputProps={{
										name: 'category',
										value: this.state.category,
									}}
								>
									<option value={'uncategorized'}>Uncategorized</option>
									<option value={'ammunition'}>Ammunition</option>
									<option value={'resource'}>Resource</option>
									<option value={'weapon'}>Weapon</option>
									<option value={'armor'}>Armor</option>
									<option value={'food'}>Food</option>
									<option value={'drink'}>Drink</option>
									<option value={'clothing'}>Clothing</option>
									<option value={'junk'}>Junk</option>
								</NativeSelect>
							</SelectFormControl>

							<HiddenSubmit type="submit" />

							<div>
								<StyledButton variant="contained" size="large" onClick={this.submitForm}>
									Add Item
								</StyledButton>
							</div>
						</CardContent>
						<HiddenSubmit type="submit" />
					</form>
				</StyledCard>
			</div>
		);
	}
}

export default CreateItem;

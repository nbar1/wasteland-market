import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
	Card,
	Typography,
	CardContent,
	TextField,
	Button,
	FormControlLabel,
	RadioGroup,
	FormControl,
	Radio,
	Checkbox,
} from '@material-ui/core';
import axios from 'axios';
import qs from 'querystring';
import { Redirect } from 'react-router-dom';

const StyledCard = styled(Card)`
	&& {
		margin: 15px 15px 30px;
	}
`;

const StyledSmallCard = styled(Card)`
	&& {
		margin: 15px;
		width: 400px;
	}
`;

const StyledTextField = styled(TextField)`
	&& {
		display: block;
		margin: 20px 0;
		position: relative;
		text-align: center;
		width: 300px;
	}
`;

const StyledMultilineTextField = styled(TextField)`
	width: 400px;
`;

const ButtonWrapper = styled.div`
	margin: -10px 0 30px 20px;
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
	/**
	 * state
	 *
	 * @type {object}
	 */
	state = {
		type: 'buy',
		platform: null,
		item: '',
		price: '',
		quantity: '1',
		unusual: false,
		notes: '',
		generalError: '',
		successMessage: '',
		includeDiscord: false,
		includeSteam: false,
		missingOrderType: false,
		missingItemName: false,
		missingPrice: false,
		missingQuantity: false,
		missingPlatform: false,
		missingPCContact: false,
		missingUnusualNotes: false,
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

		this.setState({ generalError: '' });

		if (this.state.type === '') {
			this.setState({ missingOrderType: true });
			returnVal = false;
		}

		if (this.state.item === '') {
			this.setState({ missingItemName: true });
			returnVal = false;
		}

		if (this.state.price === '' || this.state.price < 1) {
			this.setState({ missingPrice: true });
			returnVal = false;
		}

		if (this.state.quantity === '' || this.state.quantity < 1) {
			this.setState({ missingQuantity: true });
			returnVal = false;
		}

		if (this.state.platform === null) {
			this.setState({ missingPlatform: true });
			returnVal = false;
		}

		if (this.state.platform === 'pc' && !this.state.includeDiscord && !this.state.includeSteam) {
			this.setState({ missingPCContact: true });
			returnVal = false;
		}

		if (this.state.unusual && this.state.notes === '') {
			this.setState({ missingUnusualNotes: true });
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
			missingOrderType: false,
			missingItemName: false,
			missingPrice: false,
			missingQuantity: false,
			missingPlatform: false,
			missingPCContact: false,
			missingUnusualNotes: false,
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

		// Register
		axios
			.post(
				'/api/market/order',
				qs.stringify({
					type: this.state.type,
					platform: this.state.platform,
					item: this.state.item,
					price: this.state.price,
					quantity: this.state.quantity,
					unusual: this.state.unusual,
					notes: this.state.notes,
					includeDiscord: this.state.includeDiscord,
					includeSteam: this.state.includeSteam,
				})
			)
			.then(res => {
				if (res.data.success === true && res.data.message === 'order-created') {
					this.setState({
						orderSuccess: true,
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

	/**
	 * render
	 *
	 * @returns {jsx}
	 */
	render() {
		if (this.state.orderSuccess) {
			return <Redirect to="/order/success" />;
		}

		return (
			<div>
				<form onSubmit={this.submitForm}>
					<StyledCard raised={true}>
						<CardContent>
							<Typography gutterBottom variant="headline" component="h2">
								Order Type
							</Typography>
							{this.state.generalError && <GeneralError>{this.state.generalError}</GeneralError>}
							{this.state.successMessage && <SuccessMessage>{this.state.successMessage}</SuccessMessage>}
							<FormControl component="fieldset">
								<RadioGroup name="type" value={this.state.type} onChange={this.onChange}>
									<FormControlLabel value="buy" control={<Radio />} label="Buy" />
									<FormControlLabel value="sell" control={<Radio />} label="Sell" />
								</RadioGroup>
							</FormControl>
						</CardContent>
					</StyledCard>

					<StyledCard raised={true}>
						<CardContent>
							<Typography gutterBottom variant="headline" component="h2">
								Item Details
							</Typography>
							<StyledTextField
								type="text"
								id="item"
								name="item"
								label="Item Name"
								margin="normal"
								autoComplete="off"
								fullWidth={true}
								value={this.state.name}
								onChange={this.onChange}
								error={this.state.missingItemName ? true : false}
								helperText={this.state.missingItemName ? 'Please enter an item name.' : false}
							/>
							<FormControlLabel
								control={
									<Checkbox
										checked={this.state.unusual}
										onChange={this.onChange.bind(this, {
											target: {
												name: 'unusual',
												value: !this.state.unusual,
											},
										})}
										name="unusual"
										value="true"
										color="primary"
									/>
								}
								label="This item has unusual attributes"
							/>
						</CardContent>
					</StyledCard>

					<StyledCard raised={true}>
						<CardContent>
							<Typography gutterBottom variant="headline" component="h2">
								Order Information
							</Typography>
							<StyledTextField
								type="number"
								id="price"
								name="price"
								label="Price"
								margin="normal"
								autoComplete="off"
								fullWidth={true}
								value={this.state.price}
								onChange={this.onChange}
								error={this.state.missingPrice ? true : false}
								helperText={this.state.missingPrice ? 'Please enter a valid amount.' : false}
							/>

							<StyledTextField
								type="number"
								id="quantity"
								name="quantity"
								label="Quantity"
								margin="normal"
								autoComplete="off"
								fullWidth={true}
								value={this.state.quantity}
								onChange={this.onChange}
								error={this.state.missingQuantity ? true : false}
								helperText={this.state.missingQuantity ? 'Please enter a valid quantity.' : false}
							/>

							{this.state.price &&
								this.state.quantity && (
									<Typography gutterBottom variant="headline">
										{this.state.price} x {this.state.quantity} ={' '}
										{this.state.price * this.state.quantity}
									</Typography>
								)}
						</CardContent>
					</StyledCard>

					<StyledCard raised={true}>
						<CardContent>
							<Typography gutterBottom variant="headline" component="h2">
								Notes
							</Typography>
							<Typography gutterBottom variant="subheading">
								Include any unusual attributes or defining information that the buyer or seller may need
								to know in order to complete a sale.
							</Typography>
							<StyledMultilineTextField
								id="notes"
								name="notes"
								label="Notes"
								multiline
								rowsMax="10"
								margin="normal"
								value={this.state.notes}
								onChange={this.onChange}
								error={this.state.missingUnusualNotes ? true : false}
								helperText={
									this.state.missingUnusualNotes
										? 'When marking an item as unusual, you must explain the item attributes.'
										: false
								}
							/>
						</CardContent>
					</StyledCard>

					<StyledCard raised={true}>
						<CardContent>
							<Typography gutterBottom variant="headline" component="h2">
								Order Platform
							</Typography>
							<Typography gutterBottom variant="subheading">
								Your platform information will be exposed so another user can contact you to buy or
								sell.
								<br />
								If your platform is not enabled, go to your Profile page and add the platform.
								<br />
								If you choose PC, you must include your Discord or Steam ID.
							</Typography>
							<FormControl component="fieldset">
								<RadioGroup name="platform" value={this.state.platform} onChange={this.onChange}>
									<FormControlLabel
										value="xbox"
										control={<Radio />}
										label={
											this.props.platforms.xbox ? `Xbox — ${this.props.platforms.xbox}` : 'Xbox'
										}
										disabled={!this.props.platforms.xbox}
									/>
									<FormControlLabel
										value="playstation"
										control={<Radio />}
										label={
											this.props.platforms.playstation
												? `PlayStation — ${this.props.platforms.playstation}`
												: 'PlayStation'
										}
										disabled={!this.props.platforms.playstation}
									/>
									<FormControlLabel
										value="pc"
										control={<Radio />}
										label="PC"
										disabled={!this.props.platforms.discord && !this.props.platforms.steam}
									/>
									<FormControlLabel
										control={
											<Checkbox
												checked={this.state.includeDiscord}
												onChange={this.onChange.bind(this, {
													target: {
														name: 'includeDiscord',
														value: !this.state.includeDiscord,
													},
												})}
												name="includeDiscord"
												value="true"
												color="primary"
												disabled={!this.props.platforms.discord}
											/>
										}
										label={
											this.props.platforms.discord
												? `Include Discord — ${this.props.platforms.discord}`
												: 'Include Discord'
										}
									/>
									<FormControlLabel
										control={
											<Checkbox
												checked={this.state.includeSteam}
												onChange={this.onChange.bind(this, {
													target: {
														name: 'includeSteam',
														value: !this.state.includeSteam,
													},
												})}
												name="includeSteam"
												value="true"
												color="primary"
												disabled={!this.props.platforms.steam || this.state.platform !== 'pc'}
											/>
										}
										label={
											this.props.platforms.steam
												? `Include Steam ID — ${this.props.platforms.steam}`
												: 'Include Steam ID'
										}
									/>
									{this.state.missingPlatform && (
										<GeneralError>You must select a platform.</GeneralError>
									)}
									{this.state.missingPCContact && (
										<GeneralError>
											When choosing PC as your platform, you must include a contact method.
										</GeneralError>
									)}
								</RadioGroup>
							</FormControl>
						</CardContent>
					</StyledCard>

					{false && (
						<StyledCard raised={true}>
							<CardContent>
								<Typography gutterBottom variant="headline" component="h2">
									Review Order
								</Typography>
								<StyledSmallCard raised={true}>
									<CardContent>
										<Typography color="textSecondary">
											{this.state.type === 'buy' ? 'Buy' : 'Sell'} Order
										</Typography>
										<Typography variant="headline" component="h2">
											{this.state.item}
										</Typography>
										<Typography component="p">Price: {this.state.price}</Typography>
										<Typography component="p">Quantity: {this.state.quantity}</Typography>
										<Typography component="p">
											Total: {this.state.price * this.state.quantity}
										</Typography>
									</CardContent>
								</StyledSmallCard>
								<ButtonWrapper>
									<StyledButton variant="contained" size="large" onClick={this.submitForm}>
										Create Order
									</StyledButton>
								</ButtonWrapper>
							</CardContent>
						</StyledCard>
					)}

					<HiddenSubmit type="submit" />

					<ButtonWrapper>
						<StyledButton variant="contained" size="large" onClick={this.submitForm}>
							Create Order
						</StyledButton>
					</ButtonWrapper>
				</form>
			</div>
		);
	}
}

Platforms.propTypes = {
	platforms: PropTypes.object,
};

export default Platforms;

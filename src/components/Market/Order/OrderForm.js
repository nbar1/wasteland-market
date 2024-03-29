import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Autosuggest from 'react-autosuggest';
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
	InputLabel,
	NativeSelect,
} from '@material-ui/core';
import axios from 'axios';
import qs from 'querystring';
import { Redirect } from 'react-router-dom';
import capImage from '../../../images/cap.png';
import ReactGA from 'react-ga';

const OrderFormWrapper = styled.div`
	margin: 0 auto;
	width: 70%;

	@media (max-width: 800px) {
		width: 100%;
	}
`;

const StyledCard = styled(Card)`
	&& {
		margin: 15px 15px 30px;
		overflow: visible;

		&.hidden,
		.hidden {
			display: none !important;
		}

		.react-autosuggest__container {
			position: relative;
		}

		.react-autosuggest__suggestions-container {
			z-index: 10;
		}
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

const SelectFormControl = styled(FormControl)`
	&& {
		display: block;
		margin: 20px 0;
		position: relative;
		width: 300px;
	}
`;

const StyledMultilineTextField = styled(TextField)`
	max-width: 400px;
	width: 100%;
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

const SearchBarWrapper = styled.div`
	.react-autosuggest__suggestions-container {
		background: #eee;
		color: #000;
		left: 0;
		position: absolute;
		top: 48px;
		width: ${props => props.width || 300}px;
	}

	ul {
		border: 1px solid #999;
		border-top: none;
		margin: 0;
		padding: 0;
		list-style: none;
		text-align: left;

		li {
			cursor: pointer;
			font-size: 18px;
			padding: 10px;

			&:hover {
				background: #999;
			}
		}
	}
`;

const LightText = styled.span`
	color: #999;
`;

const BottleCap = styled.span`
	background-image: url(${capImage});
	background-size: 20px;
	background-repeat: no-repeat;
	background-position-y: center;
	padding-left: 22px;
`;

const renderSuggestion = suggestion => <div>{suggestion.name}</div>;

const getSuggestionValue = suggestion => suggestion.name;

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
		itemId: null,
		price: '',
		quantity: '1',
		level: 0,
		unusual: false,
		notes: '',
		generalError: '',
		successMessage: '',
		includeDiscord: false,
		includeSteam: false,
		includeBethesda: false,
		missingOrderType: false,
		missingItemName: false,
		missingPrice: false,
		missingQuantity: false,
		missingPlatform: false,
		missingPCContact: false,
		missingUnusualNotes: false,
		suggestions: [],
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

		if (this.state.itemId === null) {
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
					itemId: this.state.itemId,
					price: this.state.price,
					quantity: this.state.quantity,
					level: this.state.level === 0 ? undefined : this.state.level,
					unusual: this.state.unusual,
					notes: this.state.notes,
					includeDiscord: this.state.includeDiscord,
					includeSteam: this.state.includeSteam,
					includeBethesda: this.state.includeBethesda,
				})
			)
			.then(res => {
				if (res.data.success === true && res.data.message === 'order-created') {
					this.setState({
						orderSuccess: true,
					});

					ReactGA.event({
						category: 'Market',
						action: 'Create Order',
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

	onItemNameChange = (event, { newValue }) => {
		let itemId;

		try {
			itemId = this.state.suggestions.filter(item => item.name === newValue)[0]._id;
		}
		catch (ex) {
			itemId = null;
		}

		this.setState({
			item: newValue,
			itemId,
		});
	};

	// Autosuggest will call this function every time you need to update suggestions.
	// You already implemented this logic above, so just use it.
	onSuggestionsFetchRequested = ({ value }) => {
		axios
			.post(
				'/api/search/autocomplete',
				qs.stringify({
					query: value,
				})
			)
			.then(res => {
				if (res.data) {
					this.setState({
						suggestions: res.data.data,
					});
				}
			})
			.catch((err, res) => {
				this.setState({
					suggestions: [],
				});
			});
	};

	// Autosuggest will call this function every time you need to clear suggestions.
	onSuggestionsClearRequested = () => {
		this.setState({
			suggestions: [],
		});
	};

	/**
	 * render
	 *
	 * @returns {jsx}
	 */
	render() {
		if (this.state.orderSuccess) {
			return <Redirect to={`/market/${this.state.item.replace(/\s+/g, '-').toLowerCase()}`} />;
		}

		const levelOptions = [];
		for (let i = 1; i < 51; i++) {
			levelOptions.push(
				<option key={i} value={i}>
					{i}
				</option>
			);
		}

		return (
			<OrderFormWrapper>
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
							<SearchBarWrapper>
								<Autosuggest
									renderInputComponent={inputProps => {
										const { ref, ...other } = inputProps;
										return (
											<StyledTextField
												type="text"
												id="item"
												name="item"
												label="Item Name"
												margin="normal"
												autoComplete="off"
												fullWidth={true}
												style={{ position: 'relative' }}
												error={this.state.missingItemName ? true : false}
												helperText={
													this.state.missingItemName ? 'Please select a valid item.' : false
												}
												InputProps={{ inputRef: ref, ...other }}
											/>
										);
									}}
									value={this.state.item}
									suggestions={this.state.suggestions}
									onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
									onSuggestionsClearRequested={this.onSuggestionsClearRequested}
									getSuggestionValue={getSuggestionValue}
									renderSuggestion={renderSuggestion}
									inputProps={{
										value: this.state.item,
										onChange: this.onItemNameChange,
									}}
								/>
							</SearchBarWrapper>

							<StyledTextField
								type="number"
								id="price"
								name="price"
								label="Price (each)"
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
								label="Quantity Available"
								margin="normal"
								autoComplete="off"
								fullWidth={true}
								value={this.state.quantity}
								onChange={this.onChange}
								error={this.state.missingQuantity ? true : false}
								helperText={this.state.missingQuantity ? 'Please enter a valid quantity.' : false}
							/>

							{this.state.price && this.state.quantity && (
								<Typography gutterBottom variant="headline">
									<LightText>
										{this.state.price} x {this.state.quantity} ={' '}
									</LightText>
									<BottleCap>{this.state.price * this.state.quantity}</BottleCap>
								</Typography>
							)}
						</CardContent>
					</StyledCard>

					<StyledCard raised={true} className="hidden">
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
								Platform
							</Typography>
							<Typography gutterBottom variant="subheading">
								Your platform information will be exposed so another user can contact you to buy or
								sell.
								<br />
								If your platform is not enabled, go to your Profile page and add the platform.
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
										label={
											this.props.platforms.bethesda
												? `PC (Bethesda ID) — ${this.props.platforms.bethesda}`
												: 'PC'
										}
										disabled={!this.props.platforms.bethesda}
									/>
									{false && <FormControlLabel
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
									/>}
									{this.state.missingPlatform && (
										<GeneralError>You must select a platform.</GeneralError>
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
			</OrderFormWrapper>
		);
	}
}

Platforms.propTypes = {
	platforms: PropTypes.object,
};

export default Platforms;

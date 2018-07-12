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
} from '@material-ui/core';
import axios from 'axios';
import qs from 'querystring';
import capImage from '../../../../images/cap.png';

const StyledCard = styled(Card)`
	&& {
		margin: 15px 15px 30px;
		overflow: visible;

		.react-autosuggest__container {
			position: relative;
		}

		.react-autosuggest__suggestions-container {
			z-index: 10;
		}
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
		suggestions: [],
		timestamp: new Date().toISOString(),
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
	};

	/**
	 * submitForm
	 *
	 * @param {object} event
	 * @returns {void}
	 */

	submitForm = event => {
		if (event) event.preventDefault();

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
					unusual: this.state.unusual,
					notes: this.state.notes,
					includeDiscord: this.state.includeDiscord,
					includeSteam: this.state.includeSteam,
					definedTimestamp: this.state.timestamp,
				})
			)
			.then(res => {
				if (res.data.success === true && res.data.message === 'order-created') {
					this.shuffle();
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

	getTimestamp = () => {
		let start = new Date(2018, 6, 6);
		let end = new Date();

		return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
	}

	shuffle = () => {
		this.setState({
			price: Math.floor(Math.random() * 20) + 40,
			quantity: Math.floor(Math.random() * 10) + 1,
			timestamp: this.getTimestamp(),
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
										<LightText>
											{this.state.price} x {this.state.quantity} ={' '}
										</LightText>
										<BottleCap>{this.state.price * this.state.quantity}</BottleCap>
									</Typography>
								)}
						</CardContent>
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
						<CardContent>
							<Typography gutterBottom variant="headline" component="h2">
								Date/Time
							</Typography>
							<LightText>{this.state.timestamp}</LightText>
						</CardContent>
					</StyledCard>

					<HiddenSubmit type="submit" />

					<ButtonWrapper>
						<StyledButton variant="contained" size="large" onClick={this.submitForm}>
							Create Order
						</StyledButton>
					</ButtonWrapper>

					<ButtonWrapper>
						<StyledButton variant="contained" size="large" onClick={this.shuffle}>
							Shuffle
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

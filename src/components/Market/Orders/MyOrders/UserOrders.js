import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import moment from 'moment';
import styled from 'styled-components';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Paper,
	Typography,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Button,
} from '@material-ui/core';
import axios from 'axios';
import qs from 'querystring';
import capImage from '../../../../images/cap.png';
import ReactGA from 'react-ga';

const StyledPaper = styled(Paper)`
	&& {
		margin: 15px 0;

		tbody tr.wm-row-link {
			cursor: pointer;
		}
	}

	@media (max-width: 700px) {
		.hide-small {
			display: none;
		}

		.show-small {
			display: table-row;
		}
	}
`;

const BottleCap = styled.span`
	background-image: url(${capImage});
	background-size: 16px;
	background-repeat: no-repeat;
	background-position-y: center;
	padding-left: 20px;
`;

const Platform = styled.div`
	padding: 5px 0 5px 20px;

	span {
		font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif !important;
		font-weight: normal;
		padding-left: 5px;
	}

	&:before {
		font-family: 'Font Awesome 5 Brands';
		font-size: 13px;
		line-height: 17px;
		position: absolute;
		margin-left: -20px;
	}

	&.pc:before {
		color: #a50000;
		content: '\f108';
		font-family: 'Font Awesome 5 Free';
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

	&.bethesda:before {
		color: #000;
		content: '\f085';
		font-family: 'Font Awesome 5 Free';
		font-weight: 900;
		font-size: 18px;
		margin-top: 23px;
	}
`;

const StyledTableHeader = styled(Typography)`
	padding: 20px 20px 0;
	text-transform: capitalize;
`;

const DetailsFieldset = styled.div`
	color: rgba(0, 0, 0, 0.54);
	min-width: 400px;
	padding: 10px 0;

	> label {
		color: #555;
		font-weight: bold;
		margin-right: 15px;
		vertical-align: top;

		&.label-block {
			display: block;
		}
	}

	> div {
		display: inline-block;

		> div {
			padding-top: 0;

			&:before {
				line-height: 20px;
			}
		}
	}
`;

class UserOrders extends Component {
	/**
	 * state
	 *
	 * @type {object}
	 */
	state = {
		orders: [],
		dialogOpen: false,
		dialogDetails: {
			order: null,
			itemName: null,
			price: null,
			platform: null,
			quantity: null,
			unusual: null,
			date: null,
			notes: null,
			level: null,
		},
	};

	/**
	 * componentDidMount
	 *
	 * @returns {void}
	 */
	componentDidMount() {
		this.getOrders();
	}

	/**
	 * orderIsMine
	 *
	 * @returns {bool}
	 */
	orderIsMine() {
		if (!this.state.dialogDetails.order) return false;
		if (!this.props.authContext.id) return false;
		if (this.state.dialogDetails.order.user._id !== this.props.authContext.id) return false;

		return true;
	}

	/**
	 * openDialog
	 *
	 * @param {int} key
	 * @returns {void}
	 */
	openDialog(key) {
		this.setState({
			dialogOpen: true,
			dialogDetails: {
				order: this.state.orders[key],
				itemName: this.state.orders[key].item.name,
				price: this.state.orders[key].price,
				platform: this.state.orders[key].platform,
				quantity: this.state.orders[key].quantity,
				unusual: this.state.orders[key].unusual,
				date: this.state.orders[key].date,
				notes: this.state.orders[key].notes,
				level: this.state.orders[key].level ? this.state.orders[key].level : undefined,
			},
		});

		ReactGA.event({
			category: 'Market',
			action: 'Open Order Details',
		});
	}

	/**
	 * closeDialog
	 *
	 * @returns {void}
	 */
	closeDialog() {
		this.setState({
			dialogOpen: false,
			dialogDetails: {
				order: null,
				itemName: null,
				price: null,
				platform: null,
				quantity: null,
				unusual: null,
				date: null,
				notes: null,
				level: null,
			},
		});
	}

	/**
	 * closeOrder
	 *
	 * @returns {void}
	 */
	closeOrder() {
		axios
			.post(
				'/api/market/orders/close',
				qs.stringify({
					orderId: this.state.dialogDetails.order._id,
				})
			)
			.then(res => {
				if (res.data.success === true) {
					this.closeDialog();
					this.getOrders();
				}

				ReactGA.event({
					category: 'Market',
					action: 'Close Order',
				});
			})
			.catch(() => {});
	}

	/**
	 * getOrders
	 *
	 * @param {int} [page=1]
	 * @returns {void}
	 */
	getOrders = (page = 1) => {
		let url = `/api/market/orders/${this.props.type}?page=${page}`;
		url += `&user=${this.props.authContext.id}`;

		axios
			.get(url)
			.then(res => {
				this.setState({
					orders: res.data,
				});
			})
			.catch((err, res) => {});
	};

	/**
	 * showPlatformContactInfo
	 *
	 * @param {object} order
	 * @param {bool} showAsItem
	 * @returns {jsx}
	 */
	showPlatformContactInfo = (order, showAsItem = false) => {
		if (order === null) return;

		return (
			<div>
				{order.platform === 'xbox' ? (
					<Platform title={`Xbox: ${order.user.platforms.xbox}`} className="xbox">
						<span>{showAsItem ? order.item.name : order.user.platforms.xbox}</span>
					</Platform>
				) : (
					''
				)}
				{order.platform === 'playstation' ? (
					<Platform title={`PlayStation: ${order.user.platforms.playstation}`} className="playstation">
						<span>{showAsItem ? order.item.name : order.user.platforms.playstation}</span>
					</Platform>
				) : (
					''
				)}
				{order.platform === 'pc' ? (
					<Platform title={`PC (Bethesda ID): ${order.user.platforms.bethesda}`} className="pc fas">
						<span>{showAsItem ? order.item.name : order.user.platforms.bethesda}</span>
					</Platform>
				) : (
					''
				)}
			</div>
		);
	};

	/**
	 * componentDidUpdate
	 *
	 * @returns {(void|null)}
	 */
	componentDidUpdate() {
		if (this.state.orders.length > 0) return;

		// this.getOrders();
	}

	/**
	 * render
	 *
	 * @returns {jsx}
	 */
	render() {
		return (
			<Route
				render={({ history }) => (
					<StyledPaper className="wm-orders">
						<StyledTableHeader gutterBottom variant="title" component="h2">
							{this.props.title}
						</StyledTableHeader>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Item</TableCell>
									<TableCell numeric>Price</TableCell>
									<TableCell className="hide-small" numeric>
										Quantity
									</TableCell>
									<TableCell className="hide-small" numeric>
										Time
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{this.state.orders.map((order, key) => {
									return (
										<TableRow
											key={key}
											className="wm-row-link"
											hover={true}
											onClick={() => this.openDialog(key)}
										>
											<TableCell scope="row">
												{this.showPlatformContactInfo(order, true)}
											</TableCell>
											<TableCell numeric>
												<BottleCap title={`${order.price} Caps`}>{order.price}</BottleCap>
											</TableCell>
											<TableCell className="hide-small" numeric>
												{order.quantity}
											</TableCell>
											<TableCell className="hide-small" numeric>
												{moment(order.date).fromNow()}
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
						<Dialog
							open={this.state.dialogOpen}
							onClose={this.closeDialog}
							aria-labelledby="alert-dialog-title"
							aria-describedby="alert-dialog-description"
						>
							<DialogTitle id="alert-dialog-title">Order Details</DialogTitle>
							<DialogContent>
								<DetailsFieldset>
									<label>Item</label>
									{this.state.dialogDetails.itemName}
								</DetailsFieldset>
								<DetailsFieldset>
									<label>Price (each)</label>
									<BottleCap title={`${this.state.dialogDetails.price} Caps`}>
										{this.state.dialogDetails.price}
									</BottleCap>
								</DetailsFieldset>
								<DetailsFieldset>
									<label>Quantity</label>
									{this.state.dialogDetails.quantity}
								</DetailsFieldset>
								<DetailsFieldset>
									<label>Platform</label>
									{this.state.dialogDetails.platform}
								</DetailsFieldset>
								<DetailsFieldset>
									<label>Date Added</label>
									{moment(this.state.dialogDetails.date).fromNow()}
								</DetailsFieldset>
								<DetailsFieldset>
									<label>User</label>
									{this.showPlatformContactInfo(this.state.dialogDetails.order)}
								</DetailsFieldset>
							</DialogContent>
							<DialogActions>
								{this.orderIsMine() ? (
									<Button onClick={this.closeOrder.bind(this)} color="secondary">
										Close Order
									</Button>
								) : null}
								<Button onClick={this.closeDialog.bind(this)} color="primary">
									Done
								</Button>
							</DialogActions>
						</Dialog>
					</StyledPaper>
				)}
			/>
		);
	}
}

UserOrders.propTypes = {
	type: PropTypes.oneOf(['buy', 'sell']).isRequired,
	title: PropTypes.string.isRequired,
	platform: PropTypes.string,
	authContext: PropTypes.object,
};

export default UserOrders;

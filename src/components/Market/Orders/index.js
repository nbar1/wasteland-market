import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import moment from 'moment';
import styled from 'styled-components';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography } from '@material-ui/core';
import axios from 'axios';
import capImage from '../../../images/cap.png';

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

	&:before {
		font-family: 'Font Awesome 5 Brands';
		font-size: 13px;
		line-height: 17px;
		position: absolute;
		margin-left: -20px;
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

	&.steam:before {
		color: #171a21;
		content: '\f1b6';
	}
`;

const StyledTableHeader = styled(Typography)`
	padding: 20px 20px 0;
	text-transform: capitalize;
`;

class Orders extends Component {
	/**
	 * state
	 *
	 * @type {object}
	 */
	state = {
		orders: [],
	};

	/**
	 * componentDidMount
	 *
	 * @returns {void}
	 */
	componentDidMount() {
		if (this.props.allItems === true) {
			this.getOrders();
		}
	}

	/**
	 * getOrders
	 *
	 * @param {int} [page=1]
	 * @returns {void}
	 */
	getOrders = (page = 1) => {
		let url = `/api/market/orders/${this.props.type}?page=${page}`;
		url += this.props.itemId ? `&item=${this.props.itemId}` : '';
		url += this.props.platform ? `&platform=${this.props.platform}` : '';

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
	 * @returns {jsx}
	 */
	showPlatformContactInfo = order => {
		return (
			<div>
				{this.props.platform === 'xbox' ? (
					<Platform title={`Xbox: ${order.user.platforms.xbox}`} className="xbox">
						{order.user.platforms.xbox}
					</Platform>
				) : (
					''
				)}
				{this.props.platform === 'playstation' ? (
					<Platform title={`PlayStation: ${order.user.platforms.playstation}`} className="playstation">
						{order.user.platforms.playstation}
					</Platform>
				) : (
					''
				)}
				{this.props.platform === 'pc' && order.includeSteam ? (
					<Platform title={`Steam ID: ${order.user.platforms.steam}`} className="steam">
						{order.user.platforms.steam}
					</Platform>
				) : (
					''
				)}
				{order.includeDiscord ? (
					<Platform title={`Discord: ${order.user.platforms.discord}`} className="discord">
						{order.user.platforms.discord}
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
		if (this.props.itemId === null || this.state.orders.length > 0) return;

		this.getOrders();
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
								{this.props.itemId && (
									<TableRow>
										<TableCell>User</TableCell>
										<TableCell numeric>Price</TableCell>
										<TableCell className="hide-small" numeric>Quantity</TableCell>
										<TableCell className="hide-small" numeric>Time</TableCell>
									</TableRow>
								)}
								{this.props.allItems && (
									<TableRow>
										<TableCell>Item</TableCell>
										<TableCell numeric>Price</TableCell>
										<TableCell className="hide-small" numeric>Time</TableCell>
									</TableRow>
								)}
							</TableHead>
							<TableBody>
								{this.props.itemId &&
									this.state.orders.map((order, key) => {
										return (
											<TableRow key={key}>
												<TableCell scope="row">{this.showPlatformContactInfo(order)}</TableCell>
												<TableCell numeric>
													<BottleCap title={`${order.price} Caps`}>
														{order.price}
													</BottleCap>
												</TableCell>
												<TableCell className="hide-small" numeric>{order.quantity}</TableCell>
												<TableCell className="hide-small" numeric>{moment(order.date).fromNow()}</TableCell>
											</TableRow>
										);
									})}
								{this.props.allItems === true &&
									this.state.orders.map((order, key) => {
										return (
											<TableRow
												key={key}
												className="wm-row-link"
												hover={true}
												onClick={() => {
													history.push(`/market/${order.item.linkName}`);
												}}
											>
												<TableCell scope="row">{order.item.name}</TableCell>
												<TableCell numeric>
													<BottleCap title={`${order.price} Caps`}>
														{order.price}
													</BottleCap>
												</TableCell>
												<TableCell className="hide-small" numeric>{moment(order.date).fromNow()}</TableCell>
											</TableRow>
										);
									})}
								{!this.props.itemId &&
									!this.props.allItems && (
										<TableRow>
											<TableCell scope="row" />
											<TableCell numeric />
											<TableCell className="hide-small" numeric />
											<TableCell className="hide-small" numeric />
										</TableRow>
									)}
							</TableBody>
						</Table>
					</StyledPaper>
				)}
			/>
		);
	}
}

Orders.propTypes = {
	type: PropTypes.oneOf(['buy', 'sell']).isRequired,
	title: PropTypes.string.isRequired,
	allItems: PropTypes.bool,
	itemId: PropTypes.string,
	platform: PropTypes.string,
};

export default Orders;

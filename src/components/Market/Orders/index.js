import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import styled from 'styled-components';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography } from '@material-ui/core';
import capImage from '../../../images/cap.png';

const StyledPaper = styled(Paper)`
	&& {
		margin: 15px 0;
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
	 * getGraphTitle
	 *
	 * @returns {string}
	 */
	getGraphTitle = () => `${this.props.type} Orders`;

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
					<Platform title={`PlayStation: ${order.user.platforms.palystation}`} className="playstation">
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
	 * render
	 *
	 * @returns {jsx}
	 */
	render() {
		return (
			<div>
				<StyledPaper>
					<StyledTableHeader gutterBottom variant="title" component="h2">
						{this.getGraphTitle()}
					</StyledTableHeader>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>User</TableCell>
								<TableCell numeric>Price</TableCell>
								<TableCell numeric>Quantity</TableCell>
								<TableCell numeric>Time</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{this.props.orders.map((order, key) => {
								return (
									<TableRow key={key}>
										<TableCell scope="row">{this.showPlatformContactInfo(order)}</TableCell>
										<TableCell numeric>
											<BottleCap title={`${order.price} Bottle Caps`}>{order.price}</BottleCap>
										</TableCell>
										<TableCell numeric>{order.quantity}</TableCell>
										<TableCell numeric>{moment(order.date).fromNow()}</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</StyledPaper>
			</div>
		);
	}
}

Orders.propTypes = {
	type: PropTypes.oneOf(['buy', 'sell']).isRequired,
	orders: PropTypes.array.isRequired,
	platform: PropTypes.string.isRequired,
};

export default Orders;

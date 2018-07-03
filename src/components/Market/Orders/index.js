import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography } from '@material-ui/core';
import capImage from '../../../images/cap.png';

const StyledPaper = styled(Paper)`
	&& {
		margin: 10px 0;
	}
`;

const BottleCap = styled.span`
	background-image: url(${capImage});
	background-size: 16px;
	background-repeat: no-repeat;
	background-position-y: center;
	padding-left: 20px;
`;

class Orders extends Component {
	/**
	 * getGraphTitle
	 *
	 * @returns {string}
	 */
	getGraphTitle = () => `${this.props.type.charAt(0).toUpperCase()}${this.props.type.substr(1)}ing`;

	/**
	 * render
	 *
	 * @returns {jsx}
	 */
	render() {
		return (
			<div>
				<Typography gutterBottom variant="headline" component="h2">
					{this.getGraphTitle()}
				</Typography>
				<StyledPaper>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>User</TableCell>
								<TableCell numeric>Price</TableCell>
								<TableCell numeric>Quantity</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{this.props.orders.map((order, key) => {
								return (
									<TableRow key={key}>
										<TableCell component="th" scope="row">
											{order.addedBy}
										</TableCell>
										<TableCell numeric>
											<BottleCap>{order.price}</BottleCap>
										</TableCell>
										<TableCell numeric>{order.quantity}</TableCell>
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
};

export default Orders;

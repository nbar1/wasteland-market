import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const OrdersWrapper = styled.div`
	box-sizing: border-box;
	margin-top: 40px;
	padding: 15px;
	text-align: center;
`;

const Title = styled.div`
	font-size: 28px;
`;

const VisualGraph = styled.div`
	border: 1px solid #000;
	box-sizing: border-box;
	height: 300px;
	width: 100%;
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
			<OrdersWrapper>
				<Title>{this.getGraphTitle()}</Title>
				<VisualGraph />
			</OrdersWrapper>
		);
	}
}

Orders.propTypes = {
	type: PropTypes.oneOf(['buy', 'sell']).isRequired,
}

export default Orders;

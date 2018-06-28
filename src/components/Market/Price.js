import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import capImage from '../../images/cap.png';

const PriceWrapper = styled.div`
	box-sizing: border-box;
	display: inline-block;
	padding: 15px;
	text-align: right;
	vertical-align: top;
	width: 40%;
`;

const Amount = styled.div`
	background-image: url(${capImage});
	background-position: 0 9px;
	background-repeat: no-repeat;
	background-size: 24px 24px;
	display: inline-block;
	font-size: 36px;
	padding-left: 30px;
`;

const Change = styled.div`
	color: #666;
	font-size: 18px;

	&:before {
		font-family: 'FontAwesome';
		margin-right: 5px;
	}

	&.negative {
		color: #b80000;

		&:before {
			content: '\f0d7';
		}
	}

	&.positive {
		color: #118211;

		&:before {
			content: '\f0d8';
		}
	}
`;

class Price extends Component {
	/**
	 * getChangeClass
	 *
	 * @returns {string}
	 */
	getChangeClass = () => {
		if (this.props.change < 0) {
			return 'negative';
		}
		else if (this.props.change > 0) {
			return 'positive';
		}

		return 'neutral';
	}

	/**
	 * render
	 *
	 * @returns {jsx}
	 */
	render() {
		return (
			<PriceWrapper>
				<Amount title={`${this.props.amount} caps`}>{this.props.amount}</Amount>
				<Change className={this.getChangeClass()} title={`${this.props.change}% change, past 24 hours`}>{this.props.change}%</Change>
			</PriceWrapper>
		);
	}
}

Price.propTypes = {
	amount: PropTypes.number.isRequired,
	change: PropTypes.number.isRequired,
};

export default Price;

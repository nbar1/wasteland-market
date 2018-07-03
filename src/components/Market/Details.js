import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const DetailsWrapper = styled.div`
	box-sizing: border-box;
	display: inline-block;
	padding: 15px;
	vertical-align: top;
	width: 40%;
`;

const Name = styled.div`
	font-size: 36px;
`;

const Category = styled.div`
	color: #666;
	font-size: 24px;
`;

class Details extends Component {
	render() {
		return (
			<DetailsWrapper>
				<Name>{this.props.name}</Name>
				<Category>{this.props.category}</Category>
			</DetailsWrapper>
		);
	}
}

Details.propTypes = {
	name: PropTypes.string.isRequired,
	category: PropTypes.string,
	attributes: PropTypes.array,
};

export default Details;

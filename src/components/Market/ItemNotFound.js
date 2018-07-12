import React, { Component } from 'react';
import styled from 'styled-components';
import Helmet from 'react-helmet';

const ItemNotFoundWrapper = styled.div`
	box-sizing: border-box;
	margin: 10vh auto 0;
	padding: 15px;
	text-align: center;
	vertical-align: top;
	width: 35%;

	> img {
		max-height: 300px;
		max-width: 100%;
	}
`;

const LargeText = styled.div`
	padding-top: 30px;
	font-size: 40px;
`;

class ItemNotFound extends Component {
	render() {
		return (
			<ItemNotFoundWrapper>
				<Helmet>
					<title>Wasteland Market - Item Not Found</title>
				</Helmet>
				<img src="/images/item-not-found.png" alt="Item Not Found" />
				<LargeText>Item Not Found</LargeText>
			</ItemNotFoundWrapper>
		);
	}
}

export default ItemNotFound;

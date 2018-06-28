import React, { Component } from 'react';
import styled from 'styled-components';

import Details from './Details';
import Price from './Price';
import Graph from './Graph';
import Orders from './Orders';

const Image = styled.div`
	box-sizing: border-box;
	display: inline-block;
	padding: 15px;
	text-align: center;
	vertical-align: top;
	width: 20%;

	> img {
		max-height: 200px;
		max-width: 200px;
	}
`;

class Item extends Component {
	state = {
		name: 'Nuka-Cola',
		category: 'Food',
		price: 243,
		change: 27.3,
	}

	render() {
		return (
			<div>
				<Details name={this.state.name} category={this.state.category} />
				<Image>
					<img src={'/images/items/nuka-cola.png'} alt={this.state.name} />
				</Image>
				<Price amount={this.state.price} change={this.state.change} />
				<Graph />
				<Orders type={'sell'} />
				<Orders type={'buy'} />
			</div>
		);
	}
}

export default Item;

import React, { Component } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Helmet from 'react-helmet';

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
		max-width: 100%;
	}
`;

class Item extends Component {
	state = {
		error: false,
		name: '',
		itemId: null,
		image: 'no-item-image',
		category: '',
		price: 0,
		change: 0,
		platform: 'xbox',
		buyOrders: [],
		sellOrders: [],
	};

	constructor(props) {
		super();

		this.getItemData(props.match.params.item);
	}

	getItemData = itemName => {
		axios
			.get(`/api/item?name=${itemName}`)
			.then(res => {
				this.setState({
					name: res.data.name,
					category: res.data.category,
					itemId: res.data._id,
					image: res.data.image || 'no-item-image',
				});

				this.getBuys();
				this.getSells();
				this.getPrice();
			})
			.catch(err => {
				this.setState({ error: true });
			});
	};

	getPrice = () => {
		axios
			.get(`/api/market/price?item=${this.state.itemId}&platform=${this.state.platform}`)
			.then(res => {
				this.setState({
					price: res.data.price,
					change: res.data.change,
				});
			})
			.catch((err, res) => {});
	};

	getBuys = (page = 1) => {
		axios
			.get(`/api/market/orders/buy?item=${this.state.itemId}&platform=${this.state.platform}&page=${page}`)
			.then(res => {
				this.setState({
					buyOrders: res.data,
				});
			})
			.catch((err, res) => {});
	};

	getSells = (page = 1) => {
		axios
			.get(`/api/market/orders/sell?item=${this.state.itemId}&platform=${this.state.platform}&page=${page}`)
			.then(res => {
				this.setState({
					sellOrders: res.data,
				});
			})
			.catch((err, res) => {});
	};

	render() {
		if (this.state.error === true) {
			return <div>{'Error'}</div>;
		}

		return (
			<div>
				<Helmet>
					<title>Wasteland Market{this.state.name ? ` - ${this.state.name}` : ''}</title>
				</Helmet>
				<Details name={this.state.name} category={this.state.category} />
				<Image>
					<img src={`/images/items/${this.state.image}.png`} alt={this.state.name} />
				</Image>
				<Price amount={this.state.price} change={this.state.change} />
				<Graph />
				<Orders type={'sell'} orders={this.state.sellOrders} platform={this.state.platform} />
				<Orders type={'buy'} orders={this.state.buyOrders} platform={this.state.platform} />
			</div>
		);
	}
}

export default Item;

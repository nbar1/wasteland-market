import React, { Component } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Helmet from 'react-helmet';
import AuthContext from '../../context/AuthContext';

import Details from './Details';
import Price from './Price';
import Orders from './Orders';

import ItemNotFound from './ItemNotFound';

import HorizontalAd from '../Ad/HorizontalAd';

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

	@media (max-width: 700px) {
		display: block;
		width: 100%;
	}
`;

const RecentOrdersWrapper = styled.div`
	.wm-orders {
		@media (min-width: 1200px) {
			box-sizing: border-box;
			display: inline-block;
			margin: 1%;
			width: 48%;
		}
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
	};

	constructor(props) {
		super();

		if (props.match.params.item === undefined) {
			this.state.error = true;
			return;
		}

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

	render() {
		if (this.state.error === true) {
			return (
				<div>
					<ItemNotFound />
				</div>
			);
		}

		return (
			<div>
				<Helmet>
					<title>
						Wasteland Market
						{this.state.name ? ` - ${this.state.name}` : ''}
					</title>
				</Helmet>
				<Details name={this.state.name} category={this.state.category} />
				<Image>
					<img src={`/images/items/${this.state.image}.png`} alt={this.state.name} />
				</Image>
				<Price amount={this.state.price} change={this.state.change} />
				<AuthContext>
					{context => (
						<RecentOrdersWrapper>
							<Orders
								type={'sell'}
								title={'Sell Orders'}
								itemId={this.state.itemId}
								platform={this.state.platform}
								authContext={context}
							/>
							<Orders
								type={'buy'}
								title={'Buy Orders'}
								itemId={this.state.itemId}
								platform={this.state.platform}
								authContext={context}
							/>
						</RecentOrdersWrapper>
					)}
				</AuthContext>
				<HorizontalAd />
			</div>
		);
	}
}

export default Item;

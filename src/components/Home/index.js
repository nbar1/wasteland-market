import React, { Component } from 'react';
import RecentOrders from './RecentOrders';
import HorizontalAd from '../Ad/HorizontalAd';

class Home extends Component {
	render() {
		return (
			<div>
				<HorizontalAd />
				<RecentOrders />
				<HorizontalAd />
			</div>
		);
	}
}

export default Home;

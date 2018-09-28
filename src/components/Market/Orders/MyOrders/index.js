import React, { Component } from 'react';
import styled from 'styled-components';
import Helmet from 'react-helmet';
import AuthContext from '../../../../context/AuthContext';
import { Typography } from '@material-ui/core';

import UserOrders from './UserOrders';

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

class MyOrders extends Component {
	state = {
		platform: 'xbox',
	};

	render() {
		return (
			<div>
				<Helmet>
					<title>Wasteland Market - My Orders</title>
				</Helmet>
				<Typography gutterBottom variant="title" component="h1" align="center">
					My Orders
				</Typography>
				<AuthContext>
					{context => (
						<RecentOrdersWrapper>
							<UserOrders
								type={'sell'}
								title={'Sell Orders'}
								platform={this.state.platform}
								authContext={context}
							/>
							<UserOrders
								type={'buy'}
								title={'Buy Orders'}
								platform={this.state.platform}
								authContext={context}
							/>
						</RecentOrdersWrapper>
					)}
				</AuthContext>
			</div>
		);
	}
}

export default MyOrders;

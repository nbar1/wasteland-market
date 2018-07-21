import React from 'react';
import styled from 'styled-components';
import Orders from '../Market/Orders';

const RecentOrdersWrapper = styled.div`
	.wm-orders {
		@media (min-width: 1000px) {
			box-sizing: border-box;
			display: inline-block;
			margin: 1%;
			width: 48%;
		}
	}
`;

const RecentOrders = () => (
	<RecentOrdersWrapper>
		<Orders type={'sell'} title={'Recent Sell Orders'} allItems={true} />
		<Orders type={'buy'} title={'Recent Buy Orders'} allItems={true} />
	</RecentOrdersWrapper>
);

export default RecentOrders;

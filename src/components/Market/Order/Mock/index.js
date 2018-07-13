import React from 'react';
import Helmet from 'react-helmet';
import { Typography } from '@material-ui/core';
import OrderForm from './OrderForm';

const OrderMock = props => (
	<div>
		<Helmet>
			<title>Wasteland Market - Create Mock Order</title>
		</Helmet>
		<Typography gutterBottom variant="headline" component="h1">
			Create Mock Order
		</Typography>
		<OrderForm platforms={props.context.platforms} />
	</div>
);

export default OrderMock;

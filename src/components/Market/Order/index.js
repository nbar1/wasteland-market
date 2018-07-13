import React from 'react';
import Helmet from 'react-helmet';
import { Typography } from '@material-ui/core';
import OrderForm from './OrderForm';

const Order = props => (
	<div>
		<Helmet>
			<title>Wasteland Market - Create Order</title>
		</Helmet>
		<Typography gutterBottom variant="headline" component="h1">
			Create Order
		</Typography>
		<OrderForm platforms={props.context.platforms} />
	</div>
);

export default Order;

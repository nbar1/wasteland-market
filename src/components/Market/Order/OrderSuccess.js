import React from 'react';
import Helmet from 'react-helmet';
import { Typography } from '@material-ui/core';

const OrderSuccess = props => (
	<div>
		<Helmet>
			<title>Wasteland Market - Order Created</title>
		</Helmet>
		<Typography gutterBottom variant="headline" component="h1">
			Your order was created.
		</Typography>
	</div>
);

export default OrderSuccess;

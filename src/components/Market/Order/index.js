import React from 'react';
import styled from 'styled-components';
import Helmet from 'react-helmet';
import { Typography } from '@material-ui/core';
import OrderForm from './OrderForm';

const StyledTypography = styled(Typography)`
	margin: 0 auto !important;
	width: 70%;

	@media (max-width: 800px) {
		width: 100%;
	}
`;

const Order = props => (
	<div>
		<Helmet>
			<title>Wasteland Market - Create Order</title>
		</Helmet>
		<StyledTypography gutterBottom variant="headline" component="h1">
			Create Order
		</StyledTypography>
		<OrderForm platforms={props.context.platforms} />
	</div>
);

export default Order;

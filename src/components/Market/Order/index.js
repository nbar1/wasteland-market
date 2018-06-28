import React from 'react';
import Helmet from 'react-helmet';
import { Redirect } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import AuthContext from '../../../context/AuthContext';
import Loading from '../../Loading';
import OrderForm from './OrderForm';

const Order = props => (
	<AuthContext>
		{context => (
			<div>
				{context.isCurrent === false ? (
					<Loading fullPage={true} />
				) : context.isLoggedIn === false ? (
					<Redirect to="/login" />
				) : (
					<div>
						<Helmet>
							<title>Wasteland Market - Create Order</title>
						</Helmet>
						<Typography gutterBottom variant="headline" component="h1">
							Create Order
						</Typography>
						<OrderForm {...context} />
					</div>
				)}
			</div>
		)}
	</AuthContext>
);

export default Order;

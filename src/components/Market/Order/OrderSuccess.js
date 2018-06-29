import React from 'react';
import Helmet from 'react-helmet';
import { Typography } from '@material-ui/core';
import AuthContext from '../../../context/AuthContext';
import Loading from '../../Loading';
import { Redirect } from 'react-router-dom';

const OrderSuccess = props => (
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
							<title>Wasteland Market - Order Created</title>
						</Helmet>
						<Typography gutterBottom variant="headline" component="h1">
							Your order was created.
						</Typography>
					</div>
				)}
			</div>
		)}
	</AuthContext>
);

export default OrderSuccess;

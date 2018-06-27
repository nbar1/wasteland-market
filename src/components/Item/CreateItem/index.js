import React from 'react';
import { Redirect } from 'react-router-dom';
import AuthContext from '../../../context/AuthContext';
import Loading from '../../Loading';
import CreateItemForm from './CreateItemForm';

const CreateItem = props => (
	<AuthContext>
		{context => (
			<div>
				{context.isCurrent === false ? (
					<Loading fullPage={true} />
				) : context.isLoggedIn === false ? (
					<Redirect to="/login" />
				) : (
					<CreateItemForm context={context} />
				)}
			</div>
		)}
	</AuthContext>
);

export default CreateItem;

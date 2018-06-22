import React from 'react';
import AuthContext from '../../context/AuthContext';
import CreateItemForm from './CreateItemForm';

const CreateItem = props => (
	<AuthContext>
		{context => <CreateItemForm context={context} />}
	</AuthContext>
);

export default CreateItem;

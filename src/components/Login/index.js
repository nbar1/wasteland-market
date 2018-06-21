import React from 'react';
import AuthContext from '../../context/AuthContext';
import LoginForm from './LoginForm';

const Login = props => (
	<AuthContext>
		{context => <LoginForm context={context} />}
	</AuthContext>
);

export default Login;

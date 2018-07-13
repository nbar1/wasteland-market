import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Redirect } from 'react-router-dom';
import Loading from '../Loading';
import AuthContext from '../../context/AuthContext';

const RequiresLogin = BaseComponent => {
	class RequiresLogin extends Component {
		render() {
			return (
				<AuthContext>
					{context => (
						<div>
							<Helmet>
								<title>Wasteland Market</title>
							</Helmet>
							{context.isCurrent === false ? (
								<Loading fullPage={true} />
							) : context.isLoggedIn === false ? (
								<Redirect to="/login" />
							) : (
								<div><BaseComponent {...this.props} context={context} /></div>
							)}
						</div>
					)}
				</AuthContext>
			);
		}
	}

	return RequiresLogin;
};

export default RequiresLogin;

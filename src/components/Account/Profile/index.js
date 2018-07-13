import React, { Component } from 'react';
import Helmet from 'react-helmet';
import Platforms from './Platforms';

class Profile extends Component {
	render() {
		return (
			<div>
				<Helmet>
					<title>Wasteland Market - Profile</title>
				</Helmet>
				<Platforms platforms={this.props.context.platforms} />
			</div>
		);
	}
}

export default Profile;

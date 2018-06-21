import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';


const UserHubWrapper = styled.div`

`;

const StyledButton = styled(Button)`
	&& {
		background: #2a2a2a;
		color: rgb(220, 182, 38);

		&:hover {
			background: #2a2a2a;
		}
	}
`;

class UserHub extends Component {
	render() {
		return (
			<UserHubWrapper>
				{this.props.context.isLoggedIn &&
					<div>{this.props.context.username}</div>
				}
				{!this.props.context.isLoggedIn &&
					<StyledButton
						variant="contained"
						component={Link}
						to={'/login'}
						onClick={this.submitForm}>Login</StyledButton>
				}
			</UserHubWrapper>
		);
	}
}

export default UserHub;

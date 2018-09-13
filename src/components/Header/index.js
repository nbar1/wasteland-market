import React, { Component } from 'react';
import styled from 'styled-components';
import { AppBar, Toolbar } from '@material-ui/core';
import AuthContext from '../../context/AuthContext';
import SearchBar from './SearchBar';
import Navigation from '../Navigation/Horizontal';
import UserHub from './UserHub';
import { Link } from 'react-router-dom';

import logo from '../../images/logo-text-white.png';
import logoBeta from '../../images/beta.svg';

const Logo = styled.img`
	height: 55px;
`;

const LogoBeta = styled.img`
	height: 35px;
	margin-left: 10px;
`;

const StyledAppBar = styled(AppBar)`
	&& {
		background: #000;
		position: fixed;
	}
`;

const SearchBarWrapper = styled.div`
	position: absolute;
	right: ${props => props.offset}px;
`;

const UserHubWrapper = styled.div`
	position: absolute;
	right: 10px;
`;

class Header extends Component {
	render() {
		return (
			<div>
				<StyledAppBar position="static">
					<Toolbar>
						<Link to={'/'}>
							<Logo src={logo} alt="Wasteland Market" />
						</Link>
						<LogoBeta src={logoBeta} alt="Beta" />
						<AuthContext>
							{context => (
								<SearchBarWrapper offset={context.isLoggedIn ? 69 : 110}>
									<SearchBar />
								</SearchBarWrapper>
							)}
						</AuthContext>
						<UserHubWrapper>
							<AuthContext>{context => <UserHub context={context} />}</AuthContext>
						</UserHubWrapper>
					</Toolbar>
				</StyledAppBar>
				<Navigation />
			</div>
		);
	}
}

export default Header;

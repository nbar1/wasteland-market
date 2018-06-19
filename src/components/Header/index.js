import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { AppBar, Toolbar, Icon } from '@material-ui/core';
import SearchBar from '../SearchBar';

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
	}
`;

class Header extends Component {
	render() {
		return (
			<div>
				<StyledAppBar position="static">
					<Toolbar>
						<Logo src={logo} alt="Wasteland Market" />
						<LogoBeta src={logoBeta} alt="Beta" />

						<SearchBar />
					</Toolbar>
				</StyledAppBar>
			</div>
		);
	}
}

Header.propTypes = {

};

export default Header;

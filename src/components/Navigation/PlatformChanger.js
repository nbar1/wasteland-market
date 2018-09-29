import React, { Component } from 'react';
import styled from 'styled-components';
import { Menu, MenuItem } from '@material-ui/core';

import logoImage from '../../images/logo-usd.png';

const PlatformWrapper = styled.div`
	cursor: pointer;
	display: inline-block;
	height: 40px;

	> img {
		background: rgba(255, 255, 255, 0.2);
		height: 24px;
		padding: 8px;
	}
`;

const Platform = styled.div`
	background: rgba(255, 255, 255, 0.2);
	cursor: pointer;
	display: inline-block;
	height: 40px;
	line-height: 39px;
	padding-left: 1px;
	text-align: center;
	width: 40px;

	&.xbox:before {
		color: #27bf28;
		content: '\f412';
	}

	&.playstation:before {
		color: #136bb3;
		content: '\f3df';
	}

	&.desktop:before {
		color: #a50000;
		content: '\f108';
	}
`;

class PlatformChanger extends Component {
	state = {
		anchorEl: null,
		platform: localStorage.getItem('wm-platform') || 'all',
	};

	handleMenu = event => {
		this.setState({ anchorEl: event.currentTarget });
	};

	handleClose = event => {
		if (event.target.getAttribute('platform') === null) {
			this.setState({ anchorEl: null });
			return;
		}

		localStorage.setItem('wm-platform', event.target.getAttribute('platform'));

		this.setState({ platform: event.target.getAttribute('platform') });

		this.setState({ anchorEl: null });

		window.location.reload();
	};

	render() {
		const open = Boolean(this.state.anchorEl);

		return (
			<PlatformWrapper>
				{this.state.platform === 'all' && <img src={logoImage} alt={'All Platforms'} onClick={this.handleMenu} />}
				{this.state.platform === 'xbox' && <Platform className={'xbox fab'} onClick={this.handleMenu} />}
				{this.state.platform === 'playstation' && (
					<Platform className={'playstation fab'} onClick={this.handleMenu} />
				)}
				{this.state.platform === 'pc' && <Platform className={'desktop fas'} onClick={this.handleMenu} />}
				<Menu
					id="menu-appbar"
					anchorEl={this.state.anchorEl}
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'right',
					}}
					transformOrigin={{
						vertical: 'top',
						horizontal: 'right',
					}}
					onClose={this.handleClose}
					open={open}
				>
					<MenuItem onClick={this.handleClose} platform="all">
						All Platforms
					</MenuItem>
					<MenuItem onClick={this.handleClose} platform="xbox">
						Xbox
					</MenuItem>
					<MenuItem onClick={this.handleClose} platform="playstation">
						PlayStation
					</MenuItem>
					<MenuItem onClick={this.handleClose} platform="pc">
						PC
					</MenuItem>
				</Menu>
			</PlatformWrapper>
		);
	}
}

export default PlatformChanger;

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import PlatformChanger from './PlatformChanger';

const StyledBar = styled.div`
	background-color: #2a2a2a;
	box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
	height: 40px;
	left: 0;
	padding: 0 10px 0 15px;
	position: fixed;
	right: 0;
	top: 64px
	z-index: 10;

	@media (max-width: 700px) {
		display: none;
	}

	> a {
		color: rgb(220, 182, 38);
		display: inline-block;
		font-size: 18px;
		line-height: 17px;
		margin-right: 10px;
		padding: 11px 15px 11px 15px;
		vertical-align: top;

		&:hover {
			background: rgba(0, 0, 0, 0.3);
		}
	}

	span {
		color: rgb(220, 182, 38);
	}
`;

const StyledDrawer = styled.div`
	background-color: #2a2a2a;
	box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
	display: none;
	min-height: 40px;
	left: 0;
	position: fixed;
	right: 0;
	top: 105px
	z-index: 10;

	@media (max-width: 700px) {
		display: block;
	}
`;

const LinkContainer = styled.div`
	display: block;

	&.closed {
		display: none;
	}

	> a {
		color: rgb(220, 182, 38);
		display: block;
		font-size: 18px;
		line-height: 17px;
		padding: 11px 15px 11px 15px;

		&:hover {
			background: rgba(0, 0, 0, 0.3);
		}
	}

	span {
		color: rgb(220, 182, 38);
	}
`;

const MenuButton = styled.div`
	text-align: left;
	width: 100%;

	> div {
		color: rgb(220, 182, 38);

		cursor: pointer;
		padding: 12px 15px;

		> span {
			font-family: 'Roboto', sans-serif;
			font-weight: normal;
			padding-left: 10px;
		}
	}
`;

class Navigation extends Component {
	state = {
		showMenu: false,
	};

	/**
	 * toggleMenu
	 *
	 * @returns {void}
	 */
	toggleMenu() {
		this.setState({
			showMenu: !this.state.showMenu,
		});
	}

	/**
	 * render
	 *
	 * @returns {jsx}
	 */
	render() {
		return (
			<div>
				<StyledBar open={true} variant={'permanent'}>
					<PlatformChanger />
					<Link to={'/order'}>Create Order</Link>
					<Link to={'/my-orders'}>My Orders</Link>
					{false && <Link to={'/market'}>Market</Link>}
					<Link to={'/faq'}>FAQ</Link>
				</StyledBar>
				<StyledDrawer open={true} variant={'permanent'}>
					<MenuButton onClick={this.toggleMenu.bind(this)}>
						<div className="fa fa-bars">
							<span>Menu</span>
						</div>
					</MenuButton>
					{this.state.showMenu ? (
						<LinkContainer>
							<Link to={'/order'} onClick={this.toggleMenu.bind(this)}>
								Create Order
							</Link>
							<Link to={'/my-orders'} onClick={this.toggleMenu.bind(this)}>
								My Orders
							</Link>
							{false && (
								<Link to={'/market'} onClick={this.toggleMenu.bind(this)}>
									Market
								</Link>
							)}
							<Link to={'/faq'} onClick={this.toggleMenu.bind(this)}>
								FAQ
							</Link>
						</LinkContainer>
					) : null}
				</StyledDrawer>
			</div>
		);
	}
}

export default Navigation;

import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { Menu, MenuItem, IconButton } from '@material-ui/core';

class Dropdown extends Component {
	state = {
		anchorEl: null,
	};

	handleMenu = event => {
		this.setState({ anchorEl: event.currentTarget });
	};

	handleClose = () => {
		this.setState({ anchorEl: null });
	};

	logout = () => {
		axios
			.get('/user/logout')
			.then(res => {
				document.location.href = '/';
				this.handleClose();
			})
			.catch((err, res) => {
				document.location.href = '/';
				this.handleClose();
			});
	};

	render() {
		const open = Boolean(this.state.anchorEl);

		return (
			<div>
				<IconButton onClick={this.handleMenu} color="inherit">
					<AccountCircle />
				</IconButton>
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
					<MenuItem onClick={this.handleClose}>Profile</MenuItem>
					<Link to="/account">
						<MenuItem onClick={this.handleClose}>
							My Account
						</MenuItem>
					</Link>
					<MenuItem onClick={this.logout}>Logout</MenuItem>
				</Menu>
			</div>
		);
	}
}

export default Dropdown;

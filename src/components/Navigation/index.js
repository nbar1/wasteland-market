import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Drawer, List, ListItem, ListItemText, Collapse } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons/';
import styled from 'styled-components';

const StyledDrawer = styled(Drawer)`
	> div {
		background-color: #2a2a2a;
		color: rgb(220, 182, 38);
		font-weight: bold;
		min-width: 250px;
		top: 64px;
	}

	span {
		color: rgb(220, 182, 38);
	}
`;

const SecondLevelListItem = styled(ListItem)`
	span {
		padding-left: 15px;
	}
`;

class Navigation extends Component {
	state = {
		categoriesOpen: false,
	};

	/**
	 * toggleCategories
	 *
	 * @returns {void}
	 */
	toggleCategories = () => {
		this.setState({
			categoriesOpen: !this.state.categoriesOpen,
		});
	};

	/**
	 * render
	 *
	 * @returns {jsx}
	 */
	render() {
		return (
			<div>
				<StyledDrawer open={true} variant={'permanent'}>
					<List disablePadding>
						<ListItem button={true}>
							<ListItemText primary="Home" />
						</ListItem>
						<ListItem button={true}>
							<ListItemText primary="Market" />
						</ListItem>
						<ListItem button={true} onClick={this.toggleCategories}>
							<ListItemText primary="Categories" />
							{this.state.categoriesOpen ? <ExpandLess /> : <ExpandMore />}
						</ListItem>
						<Collapse in={this.state.categoriesOpen} timeout="auto" unmountOnExit>
							<List disablePadding>
								<SecondLevelListItem button>
									<ListItemText primary="Weapons" />
								</SecondLevelListItem>
								<SecondLevelListItem button>
									<ListItemText primary="Armor" />
								</SecondLevelListItem>
								<SecondLevelListItem button>
									<ListItemText primary="Food" />
								</SecondLevelListItem>
								<SecondLevelListItem button>
									<ListItemText primary="Junk" />
								</SecondLevelListItem>
							</List>
						</Collapse>
					</List>
				</StyledDrawer>
			</div>
		);
	};
}

Navigation.propTypes = {

};

export default Navigation;

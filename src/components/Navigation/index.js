import React, { Component } from 'react';
import { Drawer, List, ListItem, ListItemText, Collapse } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons/';
import { Link } from 'react-router-dom';
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

const SocialLinks = styled.div`
	bottom: 70px;
	padding: 5px 10px;
	position: absolute;
	text-align: left;
`;

const SocialLink = styled.a`
	color: #fff;
	font-size: 20px;
	margin: 5px;
	padding: 5px;

	&.fa-discord {
		color: #7289da;
	}

	&.fa-reddit-alien {
		color: #ff4500;
	}

	&.fa-twitter {
		color: #00aced;
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
					<List>
						<Link to={'/'}>
							<ListItem button={true}>
								<ListItemText primary="Home" />
							</ListItem>
						</Link>
						<Link to={'/market'}>
							<ListItem button={true}>
								<ListItemText primary="Market" />
							</ListItem>
						</Link>
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
						<Link to={'/create-item'}>
							<ListItem button={true}>
								<ListItemText primary="Add Item" />
							</ListItem>
						</Link>
					</List>
					<SocialLinks>
						<SocialLink
							href="https://discord.gg/n5hTfSJ"
							target="_blank"
							className="fab fa-discord"
							title="Join Our Discord"
						/>
						<SocialLink
							href="https://reddit.com/r/WastelandMarket"
							target="_blank"
							className="fab fa-reddit-alien"
							title="Join Our Subreddit"
						/>
						<SocialLink
							href="https://twitter.com/WastelandMarket"
							target="_blank"
							className="fab fa-twitter"
							title="Follow Us On Twitter"
						/>
					</SocialLinks>
				</StyledDrawer>
			</div>
		);
	}
}

export default Navigation;

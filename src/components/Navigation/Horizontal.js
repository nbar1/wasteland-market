import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledDrawer = styled.div`
	background-color: #2a2a2a;
	height: 40px;
	left: 0;
	padding: 0 10px 0 15px;
	position: fixed;
	right: 0;
	top: 64px
	z-index: 10;

	> a {
		color: rgb(220, 182, 38);
		display: inline-block;
		font-size: 18px;
		line-height: 17px;
		margin-right: 10px;
		padding: 11px 15px 11px 15px;

		&:hover {
			background: rgba(0, 0, 0, 0.3);
		}
	}

	span {
		color: rgb(220, 182, 38);
	}
`;

const SocialLinks = styled.div`
	float: right;
	padding-right: 5px;
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
	/**
	 * render
	 *
	 * @returns {jsx}
	 */
	render() {
		return (
			<div>
				<StyledDrawer open={true} variant={'permanent'}>
					<Link to={'/order'}>Create Order</Link>
					<Link to={'/market'}>Market</Link>
					<Link to={'/create-item'}>Add Item</Link>
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

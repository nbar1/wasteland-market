import React, { Component } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import ReactGA from 'react-ga';
import qs from 'querystring';

import thumbsUp from '../../../images/valutboy-tu.png';

const UserRatingWrapper = styled.div`
	float: right;

	> img {
		cursor: pointer;
		width: 100px;
	}
`;

class UserRating extends Component {
	/**
	 * submitRating
	 *
	 * @returns {void}
	 */
	submitRating() {
		axios
			.post(
				'/api/user/rate',
				qs.stringify({
					userId: this.props.userId,
					rating: 1,
				})
			)
			.then(res => {
				this.setState({
					hasRated: true,
				});

				ReactGA.event({
					category: 'Rate',
					action: 'Rated User',
					label: this.props.userId,
				});
			})
			.catch(err => {});
	}

	/**
	 * render
	 *
	 * @returns {jsx}
	 */
	render() {
		return (
			<UserRatingWrapper onClick={this.submitRating.bind(this)}>
				<img src={thumbsUp} />
			</UserRatingWrapper>
		);
	}
}

export default UserRating;

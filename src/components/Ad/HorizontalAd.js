import React, { Component } from 'react';
import styled from 'styled-components';
import AuthContext from '../../context/AuthContext';

const HorizontalAdWrapper = styled.div`
	border: 1px solid #000;
	height: 90px;
	line-height: 90px;
	margin: 0 auto;
	text-align: center;
	width: 600px;
`;

class HorizontalAd extends Component {
	render() {
		return (
			<div>
				<AuthContext>
					{context => (
						<HorizontalAdWrapper>
							Ad Placement
						</HorizontalAdWrapper>
					)}
				</AuthContext>
			</div>
		);
	}
}

export default HorizontalAd;

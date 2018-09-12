import React, { Component } from 'react';
import styled from 'styled-components';
import AuthContext from '../../context/AuthContext';

const VerticalAdWrapper = styled.div`
	border: 1px solid #000;
	height: 600px;
	width: 100px;
`;

class VerticalAd extends Component {
	render() {
		return (
			<div>
				<AuthContext>
					{context => (
						<VerticalAdWrapper />
					)}
				</AuthContext>
			</div>
		);
	}
}

export default VerticalAd;

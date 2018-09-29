import React, { Component } from 'react';
import styled from 'styled-components';

const FooterWrapper = styled.div`
	margin-top: 25px;
	text-align: center;
`;

class Footer extends Component {
	render() {
		return (
			<FooterWrapper>
				<div>&copy; 2018 Wasteland Market</div>
			</FooterWrapper>
		);
	}
}

export default Footer;

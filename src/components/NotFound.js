import React from 'react';
import styled from 'styled-components';

const NotFoundWrapper = styled.div`
	margin-top: 20vh;
	text-align: center;
`;

const LargeText = styled.div`
	font-size: 48px;
`;

const SmallText = styled.div`
	font-size: 24px;
`;

const NotFound = (props) => {
	return (
		<NotFoundWrapper>
			<LargeText>404</LargeText>
			<SmallText>Page Not Found</SmallText>
		</NotFoundWrapper>
	)
}

export default NotFound;

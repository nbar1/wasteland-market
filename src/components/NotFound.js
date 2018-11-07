import React from 'react';
import styled from 'styled-components';

const NotFoundWrapper = styled.div`
	margin: 20vh 0;
	text-align: center;
`;

const LargeText = styled.div`
	font-size: 48px;
`;

const SmallText = styled.div`
	font-size: 24px;
`;

const NotFound = () => {
	return (
		<NotFoundWrapper>
			<LargeText>404</LargeText>
			<SmallText>Page Not Found</SmallText>
		</NotFoundWrapper>
	);
};

export default NotFound;

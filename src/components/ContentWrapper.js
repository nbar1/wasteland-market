import React from 'react';
import styled from 'styled-components';

const StyledContentWrapper = styled.div`
	margin-left: 250px;
	padding: 10px;
	padding-top: 74px;
	text-align: left;
`;

const ContentWrapper = (props) => {
	return (
		<StyledContentWrapper>
			{props.children}
		</StyledContentWrapper>
	)
}

export default ContentWrapper;

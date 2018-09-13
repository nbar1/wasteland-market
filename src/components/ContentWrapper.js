import React from 'react';
import styled from 'styled-components';

const StyledContentWrapper = styled.div`
	padding: 10px;
	padding-top: 114px;
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

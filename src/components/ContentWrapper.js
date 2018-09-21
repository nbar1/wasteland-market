import React from 'react';
import styled from 'styled-components';

const StyledContentWrapper = styled.div`
	padding: 10px;
	padding-top: 114px;
	text-align: left;

	@media (max-width: 700px) {
		padding-top: 156px;
	}
`;

const ContentWrapper = (props) => {
	return (
		<StyledContentWrapper>
			{props.children}
		</StyledContentWrapper>
	);
};

export default ContentWrapper;

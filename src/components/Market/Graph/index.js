import React, { Component } from 'react';
import styled from 'styled-components';

const GraphWrapper = styled.div`
	box-sizing: border-box;
	margin-top: 40px;
	padding: 15px;
	text-align: center;
`;

const Title = styled.div`
	font-size: 28px;
`;

const VisualGraph = styled.div`
	border: 1px solid #000;
	box-sizing: border-box;
	height: 300px;
	width: 100%;
`;

class Graph extends Component {
	render() {
		return (
			<GraphWrapper>
				<Title>Price Graph</Title>
				<VisualGraph />
			</GraphWrapper>
		);
	}
}

export default Graph;

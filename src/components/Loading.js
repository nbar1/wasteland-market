import React from "react";
import styled, { keyframes } from "styled-components";

const Grow = keyframes`
	0% {
		height: 0;
		width: 0;
	}
	99.9% {
		height: 48px;
		width: 48px;
	}
	100% {
		height: 0;
		width: 0;
	}
`;

const LoadingWrapper = styled.div`
	padding: 20px;
	margin-top: ${props => props.fullPage ? '10vh' : 0};

	.container {
		height: 50px;
		margin: 0 auto;
		position: relative;
		width: 160px;
	}

	.circle {
		background: #fff;
		background-image: radial-gradient(ellipse at center, #96E226 0%, rgba(150, 226, 38, 0) 3%, rgba(150, 226, 38, 0) 100%);
		border: 5px solid #96E226;
		border-radius: 50%;
		height: 50px;
		left: 50%;
		position: absolute;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 50px;
	}

	.circle-ani,
	.circle-ani-2 {
		animation: 1s ${Grow} ease infinite;
		border: 1px solid #96E226;
		border-radius: 50%;
		left: 50%;
		position: absolute;
		top: 50%;
		transform: translate(-50%, -50%);
	}

	.circle-ani-2 {
		animation-delay: 0.2s;
	}

	.line-top,
	.line-middle,
	.line-bottom {
		border-radius: 4px;
		border-top: 8px solid #96E226;
		left: 50%;
		transform: translate(-50%, -50%);
		position: absolute;
		width: 130px;
	}

	.line-top {
		top: 20%;
	}

	.line-middle {
		top: 50%;
	}

	.line-bottom {
		top: 80%;
	}

	.line-long {
		width: 180px;
	}
`;

const Loading = props => (
	<LoadingWrapper>
		<div className="container">
			<div className="line-top" />
			<div className="line-middle line-long" />
			<div className="line-bottom" />
			<div className="circle">
				<div className="circle-ani" />
				<div className="circle-ani-2" />
			</div>
		</div>
	</LoadingWrapper>
);

export default Loading;

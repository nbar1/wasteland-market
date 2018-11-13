import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FooterWrapper = styled.div`
	color: #2a2a2a;
	margin: 25px 0;
	text-align: center;

	ul {
		list-style: none;
		padding: 0;

		li {
			display: inline-block;
			margin: 0 20px;

			a {
				color: #2a2a2a;

				&:hover {
					text-decoration: underline;
				}
			}
		}
	}
`;

const Small = styled.div`
	font-size: 10px;
	margin-top: 15px;
`;

class Footer extends Component {
	render() {
		return (
			<FooterWrapper>
				<div>
					<ul>
						<li>
							<Link to={'/privacy-policy'}>Privacy Policy</Link>
						</li>
						<li>
							<Link to={'/terms-of-service'}>Terms of Service</Link>
						</li>
						{false && (
							<li>
								<Link to={'/contact-us'}>Contact Us</Link>
							</li>
						)}
					</ul>
				</div>
				<div>&copy; 2018 Wasteland Market</div>
				<Small>Wasteland Market is not affiliated with Bethesda or Bethesda Game Studios.</Small>
			</FooterWrapper>
		);
	}
}

export default Footer;

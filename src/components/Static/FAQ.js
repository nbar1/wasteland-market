import React, { Component } from 'react';
import styled from 'styled-components';
import Helmet from 'react-helmet';

const FAQWrapper = styled.div`
	margin: 0 auto;
	width: 70%;

	@media (max-width: 600px) {
		width: 100%;
	}
`;

class FAQ extends Component {
	render() {
		return (
			<FAQWrapper>
				<Helmet>
					<title>Wasteland Market - Frequently Asked Questions</title>
				</Helmet>
				<h2>Frequently Asked Questions</h2>

				<br />
				<h3>How Do I Create An Order?</h3>
				<div>
					You can create a buy or sell order by clicking the Create Order link in the navigation. In order to
					create an order, be sure to add your platform infomation to your profile by clicking the Profile
					link at the top-right of the page.
				</div>

				<br />
				<br />
				<h3>How Do I Close An Order?</h3>
				<div>
					Once you have completed your sale or no longer have the items, you can close the order by clicking
					the My Orders link, clicking the order you want to close, and then clicking Close Order.
				</div>

				<br />
				<br />
				<h3>How Can I Show Only Xbox/PlayStation/PC Orders?</h3>
				<div>
					On the left side of the page is the platform chooser. It's icon will represent your current
					platform, or a gear with a $ to specify all platforms.
				</div>

				<br />
				<br />
				<h3>How Do I Find A List Of All Items?</h3>
				<div>
					The item directory will be up very soon, and show all items and prices available. For now, all items
					are accessible by using the search bar.
				</div>

				<br />
				<br />
				<h3>An Item I Want Is Not Listed, Where Can I Find It?</h3>
				<div>
					For now, Wasteland Market will focus on materials and consumables, adding weapons and armor at a
					later date.
				</div>

				<br />
				<br />
				<h3>How Can I Contact Wasteland Market About An Issue?</h3>
				<div>
					You can email us at <a href="mailto:WastelandMarket@syniba.com">WastelandMarket@syniba.com</a> or message us on Reddit at <a target="_blank" rel="noopener noreferrer" href="https://www.reddit.com/user/WastelandMarket/">u/WastelandMarket</a>.
				</div>
			</FAQWrapper>
		);
	}
}

export default FAQ;

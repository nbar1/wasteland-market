import React, { Component } from 'react';
import axios from 'axios';

class Directory extends Component {
	state = {
		categories: {},
	}

	/**
	 * getOrders
	 *
	 * @param {int} [page=1]
	 * @returns {void}
	 */
	getOrders = () => {
		axios
			.get('/api/market/directory')
			.then(res => {
				this.setState({
					categories: res.data,
				});
			})
			.catch((err, res) => {});
	};

	/**
	 * componentDidMount
	 *
	 * @returns {void}
	 */
	componentDidMount = () => {
		this.getOrders();
	};

	/**
	 * render
	 *
	 * @returns {jsx}
	 */
	render() {
		return (
			<div>
				hello
			</div>
		);
	}
}

export default Directory;

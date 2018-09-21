import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import axios from 'axios';
import qs from 'querystring';
import styled from 'styled-components';

const SearchBarWrapper = styled.div`
	border-radius: 3px;
	box-shadow: 0 0 5px 2px rgba(220, 182, 38);
	width: ${props => props.width || 300}px;

	@media (max-width: 700px) {
		width: 96%;
	}

	input {
		border-radius: 3px;
		border: none;
		box-sizing: border-box;
		font-size: 18px;
		margin: 0;
		padding: 5px 30px 5px 10px;
		width: 100%;

		&:focus {
			outline: none;
		}
	}

	.react-autosuggest__suggestions-container {
		background: #eee;
		color: #000;
		left: 0;
		position: absolute;
		top: 30px;
		width: ${props => props.width || 300}px;
	}

	ul {
		border: 1px solid #999;
		border-top: none;
		margin: 0;
		padding: 0;
		list-style: none;
		text-align: left;

		li {
			cursor: pointer;
			font-size: 18px;
			padding: 10px;

			&:hover {
				background: #999;
			}
		}
	}
`;

const SearchButton = styled.i`
	color: #000;
	cursor: pointer;
	font-size: 18px;
	line-height: 30px;
	padding: 0 7px 0 5px;
	position: absolute;
	right: 0;
	top: 0;
`;

const renderSuggestion = suggestion => <div>{suggestion.name}</div>;

const getSuggestionValue = suggestion => suggestion.name;

class SearchBar extends Component {
	state = {
		value: '',
		suggestions: [],
	};

	onChange = (event, { newValue }) => {
		let itemId, linkName;

		try {
			itemId = this.state.suggestions.filter(item => item.name === newValue)[0]._id;
			linkName = this.state.suggestions.filter(item => item.name === newValue)[0].linkName;
		}
		catch (ex) {
			itemId = null;
		}

		this.setState({
			value: newValue,
			itemId,
			linkName,
		});
	};

	// Autosuggest will call this function every time you need to update suggestions.
	// You already implemented this logic above, so just use it.
	onSuggestionsFetchRequested = ({ value }) => {
		axios
			.post(
				'/api/search/autocomplete',
				qs.stringify({
					query: value,
				})
			)
			.then(res => {
				if (res.data) {
					this.setState({
						suggestions: res.data.data,
					});
				}
			})
			.catch((err, res) => {
				this.setState({
					suggestions: [],
				});
			});
	};

	onSuggestionSelected = (event, data) => {
		window.location.href = `/market/${data.suggestion.linkName}`;
	};

	// Autosuggest will call this function every time you need to clear suggestions.
	onSuggestionsClearRequested = () => {
		this.setState({
			suggestions: [],
		});
	};

	render() {
		const inputProps = {
			placeholder: 'Search Market',
			value: this.state.value,
			onChange: this.onChange,
		};

		return (
			<SearchBarWrapper>
				<Autosuggest
					value={this.state.value}
					suggestions={this.state.suggestions}
					onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
					onSuggestionsClearRequested={this.onSuggestionsClearRequested}
					onSuggestionSelected={this.onSuggestionSelected}
					getSuggestionValue={getSuggestionValue}
					renderSuggestion={renderSuggestion}
					inputProps={inputProps}
				/>
				{false && (<SearchButton className="material-icons">search</SearchButton>)}
			</SearchBarWrapper>
		);
	}
}

SearchBar.propTypes = {
	value: PropTypes.string,
	width: PropTypes.number,
};

export default SearchBar;

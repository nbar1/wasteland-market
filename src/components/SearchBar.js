import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const SearchBarWrapper = styled.div`
	border-radius: 3px;
	box-shadow: 0 0 5px 2px rgba(220, 182, 38);
	position: absolute;
	right: 20px;
`;

const SearchInput = styled.input`
	border-radius: 3px;
	border: none;
	font-size: 18px;
	padding: 5px 30px 5px 10px;
	width: ${props => props.width || 300}px;

	&:focus {
		outline: none;
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
`;

class SearchBar extends Component {
	render() {
		return (
			<SearchBarWrapper>
				<SearchInput type="text" placeholder="search" value={this.props.value} />
				<SearchButton className="material-icons">search</SearchButton>
			</SearchBarWrapper>
		);
	}
}

SearchBar.propTypes = {
	value: PropTypes.string,
	width: PropTypes.number,
};

export default SearchBar;

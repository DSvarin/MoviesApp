/* eslint-disable react/destructuring-assignment */

import React from 'react';
import PropTypes from 'prop-types';

import debounce from 'lodash.debounce';

import './movie-search.css';

const MovieSearch = ({ onQueryChange }) => {
  const onSearchChange = (event) => {
    onQueryChange(event.target.value);
  };

  const onPressEnter = (event) => {
    if (event.key === 'Enter') {
      onQueryChange(event.target.value);
      // eslint-disable-next-line no-param-reassign
      event.target.value = '';
      document.querySelector('input').blur();
    }
  };

  return (
    <div className="search-panel">
      <input placeholder="Type to search..." onKeyUp={onPressEnter} onChange={debounce(onSearchChange, 500)} />
    </div>
  );
};

MovieSearch.defaultProps = {
  onQueryChange: () => {},
};

MovieSearch.propTypes = {
  onQueryChange: PropTypes.func,
};

export default MovieSearch;

/* eslint-disable react/destructuring-assignment */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import debounce from 'lodash.debounce';

import './movie-search.css';

export default class MovieSearch extends Component {
  state = {
    value: '',
  };

  static defaultProps = {
    onQueryChange: () => {},
  };

  static propTypes = {
    onQueryChange: PropTypes.func,
  };

  onSearchChange = (event) => {
    this.props.onQueryChange(event.target.value);
  };

  onPressEnter = (event) => {
    event.preventDefault();

    const regexp = /\b.{1}\b/;

    if (regexp.test(event.key)) {
      this.setState(({ value }) => {
        const oldValue = value;
        const newValue = oldValue + event.key;

        return {
          value: newValue,
        };
      });
    }

    if (event.key === 'Backspace') {
      this.setState(({ value }) => {
        const oldValue = value;
        const newValue = oldValue.slice(0, oldValue.length - 1);

        return {
          value: newValue,
        };
      });
    }

    if (event.key === 'Enter') {
      setTimeout(() => {
        this.setState({ value: '' });
      }, 350);
    }
  };

  render() {
    return (
      <div className="search-panel">
        <input
          placeholder="Type to search..."
          value={this.state.value}
          onKeyUp={this.onPressEnter}
          onChange={debounce(this.onSearchChange, 500)}
        />
      </div>
    );
  }
}

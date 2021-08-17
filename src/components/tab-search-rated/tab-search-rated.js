import React from 'react';

import PropTypes from 'prop-types';

import './tab-search-rated.css';

const Tab = ({ tab, onTabChange }) => {
  let buttons = [{ name: 'Search' }, { name: 'Rated' }];

  buttons = buttons.map(({ name }) => {
    const isActive = tab === name;
    const classNameButton = isActive ? 'selected' : '';

    return (
      <button key={name} type="button" className={classNameButton} onClick={() => onTabChange(name)}>
        {name}
      </button>
    );
  });

  return <div className="tabs"> {buttons} </div>;
};

Tab.defaultProps = {
  tab: 'Search',
  onTabChange: () => {},
};

Tab.propTypes = {
  tab: PropTypes.string,
  onTabChange: PropTypes.func,
};

export default Tab;

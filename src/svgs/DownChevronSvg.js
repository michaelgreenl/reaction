import React from 'react';
import PropTypes from 'prop-types';

export const DownChevronSvg = (props) => {
  return (
    <svg className={props.className} viewBox='0 0 75 75' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M67.5 22.5L37.5 52.5M7.5 22.5L37.5481 52.5' strokeLinecap='round' />
    </svg>
  );
};

DownChevronSvg.propTypes = {
  className: PropTypes.string,
};

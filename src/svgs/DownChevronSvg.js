import React from 'react';
import PropTypes from 'prop-types';

export const DownChevronSvg = (props) => {
  return (
    <svg className={props.className} viewBox='0 0 55 33' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M51.575 2.64349L27.9811 30.0448M2.66458 3.84967L27.7315 29.8072' strokeWidth='5' strokeLinecap='round' />
    </svg>
  );
};

DownChevronSvg.propTypes = {
  className: PropTypes.string,
  getPath: PropTypes.func,
};

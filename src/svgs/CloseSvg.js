import React from 'react';
import PropTypes from 'prop-types';

export const CloseSvg = (props) => {
  return (
    <svg className={props.className} viewBox='0 0 75 75' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M67.5 7.5L7.59623 67.4982M7.5 7.5L67.402 67.5' strokeLinecap='round' />
    </svg>
  );
};

CloseSvg.propTypes = {
  className: PropTypes.string,
};

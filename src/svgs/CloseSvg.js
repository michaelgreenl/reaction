import React from 'react';
import PropTypes from 'prop-types';

export const CloseSvg = (props) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' className={props.className}>
      <g>
        <path
          d='m17.414 16 6.293-6.293a1 1 0 0 0-1.414-1.414L16 14.586 9.707 8.293a1 1 0 0 0-1.414 1.414L14.586 16l-6.293 6.293a1 1 0 1 0 1.414 1.414L16 17.414l6.293 6.293a1 1 0 0 0 1.414-1.414z'
          fill='#000000'
          data-original='#000000'
          className=''
        ></path>
      </g>
    </svg>
  );
};

CloseSvg.propTypes = {
  className: PropTypes.string,
};

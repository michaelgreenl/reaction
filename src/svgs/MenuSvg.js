import React from 'react';
import propTypes from 'prop-types';

export const MenuSvg = (props) => {
  return (
    <svg className={props.className} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' xmlSpace='preserve'>
      <g>
        <g data-name='4'>
          <path d='M2 6h28v2H2zM2 15h28v2H2zM2 24h28v2H2z' fill='#000000' data-original='#000000' className=''></path>
        </g>
      </g>
    </svg>
  );
};

MenuSvg.propTypes = {
  className: propTypes.string,
};

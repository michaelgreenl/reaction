import React from 'react';
import PropTypes from 'prop-types';

export const PolygonSvg = (props) => {
  return (
    <svg className={props.className} style={{ ...props.styling }} viewBox='0 0 6 12' xmlns='http://www.w3.org/2000/svg'>
      <path d='M0.624262 6.36797C0.279535 5.9779 0.291721 5.38861 0.652277 5.01312L2.48518 3.10434L4.21367 1.07719C4.81692 0.3697 5.97475 0.796403 5.97461 1.72616L5.97336 10.0757C5.97322 11.0313 4.76113 11.4424 4.17974 10.684L2.48547 8.47397L0.624262 6.36797Z' />
    </svg>
  );
};

PolygonSvg.propTypes = {
  className: PropTypes.string,
  styling: PropTypes.object,
};

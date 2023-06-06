import React from 'react';
import './Logo.css';
import PropTypes from 'prop-types';
import { LogoSvg } from '../../svgs/LogoSvg';

export const LogoText = (props) => {
  return (
    <div className='logo-text'>
      <LogoSvg className={props.svgClassName} />
      <h1 className={`text ${props.textClassName}`}>Reaction</h1>
    </div>
  );
};

LogoText.propTypes = {
  svgClassName: PropTypes.string,
  textClassName: PropTypes.string,
};

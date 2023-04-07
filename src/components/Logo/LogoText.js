import React from 'react';
import './Logo.css';
import PropTypes from 'prop-types';
import { LogoSvg } from '../../svgs/LogoSvg';

export const LogoText = (props) => {
  return (
    <div className='logo-text'>
      <LogoSvg styling={props.svgSize} />
      {/* FIXME: Make font size dynamic with textSize prop */}
      <h1 className='text' style={props.textSize}>
        Reaction
      </h1>
    </div>
  );
};

LogoText.propTypes = {
  svgSize: PropTypes.string,
  textSize: PropTypes.string,
};

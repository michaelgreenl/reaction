import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

export const Button = (props) => {
  return (
    <button className={`button ${props.className}`} style={{ ...props.styling }} onClick={props.onClick}>
      <span className='button-text'>{props.text}</span>
    </button>
  );
};

Button.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
  styling: PropTypes.object,
  text: PropTypes.string,
};

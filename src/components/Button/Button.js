import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

export const Button = (props) => {
  return (
    <button className='button' style={{ ...props.styling }} onClick={props.onClick}>
      <span className='button-text'>{props.text}</span>
    </button>
  );
};

Button.propTypes = {
  onClick: PropTypes.func,
  styling: PropTypes.object,
  text: PropTypes.string,
};

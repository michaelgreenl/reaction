import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

export const Button = (props) => {
  return (
    <button className='button' onClick={props.onClick}>
      {props.text}
    </button>
  );
};

Button.propTypes = {
  onClick: PropTypes.func,
  text: PropTypes.string,
};

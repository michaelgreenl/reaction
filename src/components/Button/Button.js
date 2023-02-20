import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

function Button(props) {
  return (
    <button className='button' onClick={props.onClick}>
      {props.text}
    </button>
  );
}

Button.propTypes = {
  onClick: PropTypes.func,
  text: PropTypes.string,
};

export default Button;

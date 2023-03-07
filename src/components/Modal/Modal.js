import React from 'react';
import PropTypes from 'prop-types';
import './Modal.css';

function Modal(props) {
  // TODO: Make input go to setting value for user
  return (
    <div className='modal'>
      <h3 className='header'>{props.header}</h3>
      <p>{props.message}</p>
      <footer className='footer'>
        <input type='radio'>{props.canCancel ? "Don't ask this again" : "Don't show this message again"}</input>
        {props.canCancel ? <button className='modal-button'>Cancel</button> : undefined}
        <button className='modal-button'>Ok</button>
      </footer>
    </div>
  );
}

Modal.propTypes = {
  header: PropTypes.string,
  message: PropTypes.string,
  canCancel: PropTypes.bool,
};

export default Modal;

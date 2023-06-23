import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import './Modal.css';
import { Button } from '../Button/Button';
import { UserContext } from '../../hooks/UserContext';
import { LogoSvg } from '../../svgs/LogoSvg';

export const Modal = (props) => {
  const { user, setUser } = useContext(UserContext);
  const [optedOut, setOptedOut] = useState(false);

  function onOkClick() {
    props.buttons[props.buttons.length - 1].onClick();
    if (optedOut) {
      setUser({
        ...user,
        optOuts: {
          ...user.optOuts,
          [props.optOutOption]: true,
        },
      });
    }
  }

  return (
    <div className='modal'>
      <div className='modal-cont'>
        <header className='modal-header'>
          <LogoSvg className='modal-logo-svg' />
          <h3 className='modal-header-text'>{props.header}</h3>
        </header>
        <hr className='modal-break' />
        <p className='modal-message'>{props.message}</p>
        <div className='option-buttons'>
          {props.buttons.map((button, i) => (
            <Button
              className='option-button'
              key={i}
              text={button.text}
              onClick={i < props.buttons.length - 1 ? () => button.onClick() : () => onOkClick()}
            />
          ))}
        </div>
        {props.optOutOption && (
          <footer className='footer'>
            <input
              className='checkbox-input'
              type='checkbox'
              name='optOut'
              value={optedOut}
              checked={optedOut}
              onChange={() => setOptedOut(!optedOut)}
            />
            <label className='checkbox-label' htmlFor='optOut'>
              Don&lsquo;t show this message again
            </label>
          </footer>
        )}
      </div>
    </div>
  );
};

Modal.propTypes = {
  header: PropTypes.string,
  message: PropTypes.string,
  optOutOption: PropTypes.string,
  // onCancelClick: PropTypes.func,
  // onOkClick: PropTypes.func,
  buttons: PropTypes.array,
};

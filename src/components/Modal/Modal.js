import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import './Modal.css';
import { Button } from '../Button/Button';
import { UserContext } from '../../hooks/UserContext';

export const Modal = (props) => {
  const { user, setUser } = useContext(UserContext);
  const [optedOut, setOptedOut] = useState(false);

  function onOkClick() {
    props.onOkClick();
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
      <h3 className='header'>{props.header}</h3>
      <p>{props.message}</p>
      <div className='option-buttons'>
        {props.onCancelClick && <Button text='Cancel' onClick={() => props.onCancelClick()} />}
        <Button text='Ok' onClick={() => onOkClick()} />
      </div>
      {props.optOutOption && (
        <footer className='footer'>
          <input
            type='checkbox'
            name='optOut'
            value={optedOut}
            checked={optedOut}
            onChange={() => setOptedOut(!optedOut)}
          />
          <label htmlFor='optOut'>Don&lsquo;t show this message again</label>
        </footer>
      )}
    </div>
  );
};

Modal.propTypes = {
  header: PropTypes.string,
  message: PropTypes.string,
  optOutOption: PropTypes.string,
  onCancelClick: PropTypes.func,
  onOkClick: PropTypes.func,
};

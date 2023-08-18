import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import './CloseButton.css';
import { motion } from 'framer-motion';

export const CloseButton = (props) => {
  const [buttonState, setButtonState] = useState(props.initialOpenClose);
  const animation = useMemo(() => {
    return {
      open: 'M54.0785 4.82768L3.08192 55.8242M3 3L53.995 53.9981',
      'down-arrow': 'M51.575 2.64349L27.9811 30.0448M2.66458 3.84967L27.7315 29.8072',
    };
  });

  function onBtnClick() {
    setButtonState(buttonState === 'open' ? props.animation : 'open');
    props.onClick();
  }

  return (
    <button
      className={`close-button ${props.className}`}
      style={{ ...props.styling }}
      onClick={() => onBtnClick()}
      disabled={props.disabled}
    >
      <motion.svg
        className={`close-button-svg ${props.svgClassName}`}
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 57 57'
        fill='none'
      >
        <motion.path
          initial={animation[props.initialOpenClose]}
          animate={{ d: animation[buttonState] }}
          transition={{ duration: 0.3 }}
          strokeLinecap='round'
          d='M53.2046 3L3 53.2046'
        />
        <motion.path
          initial={animation[props.initialOpenClose]}
          animate={{ d: animation[buttonState] }}
          transition={{ duration: 0.3 }}
          strokeLinecap='round'
          d='M3.00002 3L53.2046 53.2046'
        />
      </motion.svg>
    </button>
  );
};

CloseButton.propTypes = {
  className: PropTypes.string,
  svgClassName: PropTypes.string,
  styling: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  animation: PropTypes.string,
  initialOpenClose: PropTypes.string,
};

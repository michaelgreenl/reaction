import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';
import { motion } from 'framer-motion';

export const Button = (props) => {
  return (
    <motion.button
      className={`button ${props.className}`}
      style={{ ...props.styling }}
      onClick={props.onClick ? () => props.onClick() : undefined}
      type={props.type}
      disabled={props.disabled}
      initial={props.btnInitial}
      animate={props.btnAnimate}
      exit={props.btnExit}
      variants={props.btnVariants}
      transition={props.btnTransition}
    >
      {props.text && <span className='button-text'>{props.text}</span>}
      {props.svgInitial && (
        <motion.svg
          className={`button-svg ${props.svgClassName}`}
          xmlns='http://www.w3.org/2000/svg'
          viewBox={props.viewBox} // Since all view boxes should be the same, (since svgs are morphing between each other).
          fill='none' // Fill none since stoke is what needs to be animated
        >
          <motion.path
            initial={props.svgInitial}
            animate={props.svgAnimate}
            variants={props.svgVariants}
            transition={props.svgTransition}
            d={props.svgInitialPath}
          />
        </motion.svg>
      )}
    </motion.button>
  );
};

Button.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
  type: PropTypes.string,
  styling: PropTypes.object,
  disabled: PropTypes.bool,
  btnInitial: PropTypes.any,
  btnAnimate: PropTypes.any,
  btnExit: PropTypes.any,
  btnVariants: PropTypes.object,
  btnTransition: PropTypes.object,
  text: PropTypes.string,
  svgClassName: PropTypes.string,
  viewBox: PropTypes.string,
  svgInitial: PropTypes.any,
  svgInitialPath: PropTypes.string,
  svgAnimate: PropTypes.any,
  svgVariants: PropTypes.object,
  svgTransition: PropTypes.object,
};

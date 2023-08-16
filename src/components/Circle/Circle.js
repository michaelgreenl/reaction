import React, { useContext, useState } from 'react';
import './Circle.css';
import { UserContext } from '../../hooks/UserContext';
import { PropTypes } from 'prop-types';
import { motion } from 'framer-motion';

export const Circle = (props) => {
  const { user } = useContext(UserContext);
  const { gameSettings } = user;
  const [circleFade, setCircleFade] = useState(false);

  // If there is a localSettings prop the user is in the gameSettings menu and the circle should change dynamically
  // Else use the gameSettings styles
  const circleStyle = {
    ...props.styles,
    width: `${!props.localSettings ? gameSettings.circleSize : props.localSettings.circleSize}px`,
    backgroundColor: !props.localSettings ? gameSettings.circleColor : props.localSettings.circleColor,
  };

  return (
    <div
      className='circle-cont'
      style={{
        ...circleStyle,
        height: `${!props.localSettings ? gameSettings.circleSize : props.localSettings.circleSize}px`,
      }}
    >
      <motion.button
        className={`circle ${circleFade ? 'circle-fade' : undefined}`}
        initial={props.useTransition ? { height: gameSettings.circleSize, width: gameSettings.circleSize } : undefined}
        animate={props.useTransition ? { height: 12, width: 12 } : undefined} // Making sure the size stays if there's no transition needed
        onClick={() => (props.useTransition ? setCircleFade(true) : undefined)} // Activating fade transition onClick
        onTransitionEnd={() => props.onClick()} // Triggering onClick when the fade transition ends
        onAnimationComplete={!circleFade ? () => props.animationEnd() : undefined} // If the shrink animation ends without the user clicking it, the game ends
        transition={{ duration: gameSettings.shrinkTime }}
        style={{ ...circleStyle }}
      ></motion.button>
    </div>
  );
};

Circle.propTypes = {
  onClick: PropTypes.func,
  styles: PropTypes.object,
  position: PropTypes.object,
  useTransition: PropTypes.bool,
  animationEnd: PropTypes.func,
  localSettings: PropTypes.object,
};

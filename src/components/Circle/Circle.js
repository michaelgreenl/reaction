import React, { useContext, useEffect, useMemo } from 'react';
import { useStateRef } from '../../hooks/useStateRef';
import './Circle.css';
import { UserContext } from '../../hooks/UserContext';
import { PropTypes } from 'prop-types';
import { motion, useAnimation } from 'framer-motion';

export const Circle = (props) => {
  const { user } = useContext(UserContext);
  const { gameSettings } = user;

  // If there is a localSettings prop the user is in the gameSettings menu and the circle should change dynamically
  // Else use the gameSettings styles
  const circleStyle = useMemo(() => {
    return {
      ...props.styles,
      width: `${!props.localSettings ? gameSettings.circleSize.px : props.localSettings.circleSize.px}px`,
      backgroundColor: !props.localSettings ? gameSettings.circleColor : props.localSettings.circleColor,
    };
  });

  const [showCircle, setShowCircle, showCircleRef] = useStateRef({ val: true });
  const controls = useAnimation();

  useEffect(() => {
    /*
      If the animations are going to be used and showCircle is false (the circle has been clicked), or the game has ended,
      trigger the fade out animation.
    */
    if ((props.useTransition && !showCircle) || props.gameEnded) {
      controls.stop();
      controls
        .start({
          height: 12,
          width: 12,
          opacity: 0,
          transition: { duration: !props.gameEnded ? 0.025 : 0.3, ease: 'easeOut' },
        })
        .then(() => props.onClick());
    } else if (props.useTransition && showCircle) {
      controls
        .start({
          height: 12,
          width: 12,
          transition: { duration: gameSettings.shrinkTime, ease: 'easeOut' },
        })
        .then(() => (showCircleRef.current ? props.animationEnd(true) : undefined));
    }
  }, [showCircle, props.gameEnded]);

  return (
    <div
      className='circle-cont'
      style={{
        ...circleStyle,
        height: `${!props.localSettings ? gameSettings.circleSize.px : props.localSettings.circleSize.px}px`,
      }}
    >
      <motion.button
        className='circle'
        initial={
          props.useTransition ? { height: gameSettings.circleSize.px, width: gameSettings.circleSize.px } : undefined
        }
        animate={controls}
        onMouseDown={props.useTransition ? () => setShowCircle(false) : undefined} // Activating fade transition onClick
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
  gameEnded: PropTypes.bool,
};

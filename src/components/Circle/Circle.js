import React, { useContext, useState } from 'react';
import './Circle.css';
import { UserContext } from '../../hooks/UserContext';
import { PropTypes } from 'prop-types';

export const Circle = (props) => {
  const { user } = useContext(UserContext);
  const { gameSettings } = user;

  const [circleFade, setCircleFade] = useState(false);

  const circleStyle = {
    ...props.styles,
    width: `${gameSettings.circleSize}px`,
    backgroundColor: gameSettings.circleColor,
  };

  return (
    <div
      className='circle-cont'
      style={{
        ...circleStyle,
        height: `${gameSettings.circleSize}px`,
      }}
    >
      <button
        className={`circle ${circleFade ? 'circle-fade' : undefined}`}
        onMouseDown={() => (props.useTransition ? setCircleFade(true) : undefined)}
        onTransitionEnd={props.onClick}
        style={{
          ...circleStyle,
          animation: props.useTransition ? `shrink ${gameSettings.shrinkTime}s linear forwards` : 'none',
        }}
        onAnimationEnd={() => props.animationEnd()}
      ></button>
    </div>
  );
};

Circle.propTypes = {
  onClick: PropTypes.func,
  styles: PropTypes.object,
  position: PropTypes.object,
  useTransition: PropTypes.bool,
  animationEnd: PropTypes.func,
};

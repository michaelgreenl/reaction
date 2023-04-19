import React, { useContext } from 'react';
import './Circle.css';
import { GameSettingsContext } from '../../hooks/GameSettingsContext';
import { PropTypes } from 'prop-types';

export const Circle = (props) => {
  const { gameSettings } = useContext(GameSettingsContext);

  const circleStyle = {
    ...props.styles,
    width: `${gameSettings.circleSize}px`,
    backgroundColor: gameSettings.circleColor,
  };

  return (
    <div className='circle' style={circleStyle}>
      {gameSettings.showTime && <span className='time'>{gameSettings.shrinkTime}</span>}
    </div>
  );
};

Circle.propTypes = {
  styles: PropTypes.object,
};

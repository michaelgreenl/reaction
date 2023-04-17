import React, { useContext } from 'react';
import './Circle.css';
import { GameSettingsContext } from '../../hooks/GameSettingsContext';

export const Circle = () => {
  const { gameSettings } = useContext(GameSettingsContext);

  const circleStyle = {
    width: `${gameSettings.circleSize}px`,
    backgroundColor: gameSettings.circleColor,
  };

  return (
    <div className='circle' style={circleStyle}>
      {gameSettings.showTime && <span className='time'>{gameSettings.shrinkTime}</span>}
    </div>
  );
};

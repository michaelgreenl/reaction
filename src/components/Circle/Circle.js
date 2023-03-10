import React from 'react';
import './Circle.css';
import { useGameSettings } from '../../hooks/useGameSettings';

export const Circle = () => {
  const [settings] = useGameSettings();

  const circleStyle = {
    width: settings.circleSize,
    backgroundColor: settings.circleColor,
  };

  return (
    <div className='circle' style={circleStyle}>
      {settings.showTime && <span className='time'>{settings.shrinkTime}</span>}
    </div>
  );
};

import React from 'react';
import { useGameSettings } from '../../hooks/useGameSettings';
import './GameSetttings.css';

export const GameSettings = () => {
  const [gameSettings, handleChange] = useGameSettings({
    circleColor: '#FFFFFF',
    circleSize: 100,
    shrinkTime: 3,
    showTime: true,
    // gameMode: {

    // }
  });

  return (
    <div className='game-settings'>
      <h3 className='header-text'>Settings</h3>
      <input name='circleColor' type='color' value={gameSettings.circleColor} onChange={handleChange} />
      <input name='circleSize' type='range' value={gameSettings.circleSize} onChange={handleChange} />
      <input name='shrinkTime' type='number' value={gameSettings.shrinkTime} onChange={handleChange} />
      <input name='showTime' type='checkbox' value={gameSettings.showTime} onChange={handleChange} />
    </div>
  );
};

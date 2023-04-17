import React, { useContext } from 'react';
import { GameSettingsContext } from '../../hooks/GameSettingsContext';
import './GameSettings.css';

export const GameSettings = () => {
  const { gameSettings, setGameSettings } = useContext(GameSettingsContext);

  function handleChange(event) {
    setGameSettings({
      ...gameSettings,
      [event.target.name]: event.target.value,
    });
  }

  return (
    <div className='game-settings'>
      <h3 className='header-text'>Settings</h3>
      <div>
        <label htmlFor='circleColor'>Circle Color</label>
        <input
          name='circleColor'
          type='color'
          value={gameSettings.circleColor}
          onChange={(event) => handleChange(event)}
        />
      </div>
      <div>
        <label htmlFor='circleSize'>Circle Size</label>
        <input
          name='circleSize'
          type='range'
          value={gameSettings.circleSize}
          onChange={(event) => handleChange(event)}
        />
      </div>
      <div>
        <label htmlFor='shrinkTime'>Circle Shrink Time</label>
        <input
          name='shrinkTime'
          type='number'
          step='0.5'
          min='0.5'
          max='4'
          value={gameSettings.shrinkTime}
          onChange={(event) => handleChange(event)}
        />
      </div>
      <div>
        <label htmlFor='showTime'>Show Time in Circle</label>
        <input
          name='showTime'
          type='checkbox'
          value={gameSettings.showTime}
          onChange={(event) => handleChange(event)}
        />
      </div>
    </div>
  );
};

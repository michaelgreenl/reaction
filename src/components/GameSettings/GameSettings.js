import React, { useContext } from 'react';
import { UserContext } from '../../hooks/UserContext';
import { PolygonSvg } from '../../svgs/PolygonSvg';
import './GameSettings.css';

export const GameSettings = () => {
  const { user, setUser } = useContext(UserContext);

  function handleChange(name, value) {
    setUser({
      ...user,
      gameSettings: {
        ...user.gameSettings,
        [name]: value,
      },
    });
  }

  return (
    <div className='game-settings'>
      <header className='settings-header'>
        <h3 className='header-text'>Settings</h3>
        <hr className='break' />
      </header>
      <div className='input-cont'>
        <label htmlFor='circleColor'>Circle Color</label>
        <input
          name='circleColor'
          type='color'
          value={user.gameSettings.circleColor}
          onChange={(event) => handleChange(event.target.name, event.target.value)}
        />
      </div>
      <div className='input-cont'>
        <label htmlFor='circleSize'>Circle Size</label>
        <input
          className='range-input'
          name='circleSize'
          type='range'
          min='75'
          max='125'
          value={user.gameSettings.circleSize}
          onChange={(event) => handleChange(event.target.name, event.target.value)}
        />
      </div>
      <div className='input-cont'>
        <label htmlFor='shrinkTime'>Circle Shrink Time</label>
        <div className='number'>
          <input
            className='number-input'
            name='shrinkTime'
            type='number'
            step='0.5'
            min='0.5'
            max='3'
            value={user.gameSettings.shrinkTime}
            onChange={(event) => handleChange(event.target.name, event.target.value)}
          />
          <div className='number-arrows'>
            <button
              className='number-arrow'
              style={{ transform: 'translate(-2px, 12px)' }}
              onClick={() => handleChange('shrinkTime', user.gameSettings.shrinkTime - 0.5)}
              disabled={user.gameSettings.shrinkTime === 0.5}
            >
              <PolygonSvg styling={{ transform: 'rotate(-90deg)', height: '12px', fill: '#d64a80' }} />
            </button>
            <button
              className='number-arrow'
              style={{ transform: 'translate(-2px, -12px)' }}
              onClick={() => handleChange('shrinkTime', user.gameSettings.shrinkTime + 0.5)}
              disabled={user.gameSettings.shrinkTime === 3}
            >
              <PolygonSvg styling={{ transform: 'rotate(90deg)', height: '12px', fill: '#d64a80' }} />
            </button>
          </div>
        </div>
      </div>
      <div className='input-cont'>
        <label htmlFor='showTime'>Show Time in Circle</label>
        <input
          className='checkbox-input'
          name='showTime'
          type='checkbox'
          value={user.gameSettings.showTime}
          checked={user.gameSettings.showTime}
          onChange={(event) => handleChange(event.target.name, event.target.checked)}
        />
      </div>
    </div>
  );
};

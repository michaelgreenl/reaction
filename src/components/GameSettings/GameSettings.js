import React, { useContext } from 'react';
import { UserContext } from '../../hooks/UserContext';
import { PolygonSvg } from '../../svgs/PolygonSvg';
import './GameSettings.css';

export const GameSettings = () => {
  const { user, setUser } = useContext(UserContext);
  const { gameSettings } = user;
  const _ = require('lodash');

  function handleChange(name, value) {
    setUser({
      ...user,
      gameSettings: {
        ...gameSettings,
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
        <label htmlFor='shrinkTime'>Circle Shrink Time</label>
        <div className='number'>
          <input
            className='number-input'
            name='shrinkTime'
            type='number'
            step='0.5'
            min='0.5'
            max='3'
            value={gameSettings.shrinkTime}
            onChange={(event) => handleChange(event.target.name, event.target.value)}
          />
          <div className='number-arrows'>
            <button
              className='number-arrow'
              style={{ transform: 'translate(-2px, 12px)' }}
              onClick={() => handleChange('shrinkTime', gameSettings.shrinkTime - 0.5)}
              disabled={gameSettings.shrinkTime === 0.5}
            >
              <PolygonSvg styling={{ transform: 'rotate(-90deg)', height: '12px', fill: '#d64a80' }} />
            </button>
            <button
              className='number-arrow'
              style={{ transform: 'translate(-2px, -12px)' }}
              onClick={() => handleChange('shrinkTime', gameSettings.shrinkTime + 0.5)}
              disabled={gameSettings.shrinkTime === 3}
            >
              <PolygonSvg styling={{ transform: 'rotate(90deg)', height: '12px', fill: '#d64a80' }} />
            </button>
          </div>
        </div>
      </div>
      <div className='input-cont'>
        <span>Difficulty</span>
        <div className='radio-options'>
          {Object.keys(gameSettings.difficulty).map((key) => (
            <div className='radio-option' key={key}>
              <label className='radio-label' htmlFor={key}>
                {key.charAt(0).toUpperCase()}
                {key.slice(1)}
              </label>
              <input
                className='radio-input'
                name='difficulty'
                type='radio'
                value={key}
                checked={gameSettings.difficulty[`${key}`]}
                onChange={(event) =>
                  handleChange(event.target.name, {
                    ..._.mapValues(gameSettings.difficulty, () => false),
                    [event.target.value]: event.target.checked,
                  })
                }
              />
            </div>
          ))}
        </div>
      </div>
      <div className='input-cont'>
        <label htmlFor='circleColor'>Circle Color</label>
        <input
          name='circleColor'
          type='color'
          value={gameSettings.circleColor}
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
          value={gameSettings.circleSize}
          onChange={(event) => handleChange(event.target.name, event.target.value)}
        />
      </div>
      <div className='input-cont'>
        <label htmlFor='showTime'>Show Time in Circle</label>
        <input
          className='checkbox-input'
          name='showTime'
          type='checkbox'
          value={gameSettings.showTime}
          checked={gameSettings.showTime}
          onChange={(event) => handleChange(event.target.name, event.target.checked)}
        />
      </div>
    </div>
  );
};

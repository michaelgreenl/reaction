import React, { useState, useContext, forwardRef, useImperativeHandle, useEffect } from 'react';
import PropTypes from 'prop-types';
import { UserContext } from '../../hooks/UserContext';
import { Circle } from '../../components/Circle/Circle';
import { PolygonSvg } from '../../svgs/PolygonSvg';
import { CloseSvg } from '../../svgs/CloseSvg';
import './GameSettings.css';
import { Modal } from '../Modal/Modal';

export const GameSettings = forwardRef(function GameSettings(props, ref) {
  const _ = require('lodash');
  const { user, setUser } = useContext(UserContext);
  const { gameSettings } = user;
  const [localSettings, setLocalSettings] = useState(gameSettings);
  const causesResetSettings = ['shrinkTime', 'difficulty', 'circleSize'];
  const [enableScoreReset, setEnableScoreReset] = useState(false);
  const [warningEnabled, setWarningEnabled] = useState(false);

  function handleChange(name, value) {
    setLocalSettings({
      ...localSettings,
      [name]: value,
    });
  }

  useEffect(() => {
    if (!_.isEqual(localSettings, gameSettings)) {
      checkScoreReset();
      props.setResetBtnDisabled(false);
      props.setSaveBtnDisabled(false);
    } else {
      setEnableScoreReset(false);
      props.setResetBtnDisabled(true);
      props.setSaveBtnDisabled(true);
    }
  }, [localSettings]);

  function checkScoreReset() {
    let toSet = false;
    for (const setting of causesResetSettings) {
      if (localSettings[setting] !== gameSettings[setting]) {
        toSet = true;
      }
    }
    setEnableScoreReset(toSet);
  }

  function checkWarning() {
    if (enableScoreReset && !user.optOuts.saveGameSettingsWarning) {
      setWarningEnabled(true);
    } else {
      saveSettings();
    }
  }

  function saveSettings() {
    setUser({
      ...user,
      gameSettings: {
        ...localSettings,
      },
      scores: enableScoreReset ? [] : user.scores,
    });

    props.setResetBtnDisabled(true);
    props.setSaveBtnDisabled(true);
    setEnableScoreReset(false);
    setWarningEnabled(false);
  }

  function resetSettings() {
    props.setResetBtnDisabled(true);
    props.setSaveBtnDisabled(true);
    setLocalSettings({
      ...gameSettings,
    });
  }

  useImperativeHandle(ref, () => {
    return {
      saveSettings,
      resetSettings,
      checkWarning,
    };
  });

  return (
    <div className='game-settings'>
      {warningEnabled && (
        <Modal
          header='Warning'
          message='Saving these settings will reset your previous scores, since the difficulty will change.'
          optOutOption='saveGameSettingsWarning'
          onCancelClick={() => setWarningEnabled(false)}
          onOkClick={() => saveSettings()}
        />
      )}
      {props.showSettings && (
        <div className='settings-item'>
          <div className='settings'>
            <header className='settings-header'>
              <h3 className='header-text'>Settings</h3>
              <button className='close-button' onClick={() => props.setShowSettings(false)}>
                <CloseSvg className='header-close-svg' />
              </button>
            </header>
            <hr className='break' />
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
                  value={localSettings.shrinkTime}
                  onChange={(event) => handleChange(event.target.name, event.target.value)}
                />
                <div className='number-arrows'>
                  <button
                    className='number-arrow'
                    style={{ transform: 'translate(-1px, 15px) rotate(-90deg)' }}
                    onClick={() => handleChange('shrinkTime', localSettings.shrinkTime - 0.5)}
                    disabled={localSettings.shrinkTime === 0.5}
                  >
                    <PolygonSvg className='number-polygon' />
                  </button>
                  <button
                    className='number-arrow'
                    style={{ transform: 'translate(-1px, -15px) rotate(90deg)' }}
                    onClick={() => handleChange('shrinkTime', localSettings.shrinkTime + 0.5)}
                    disabled={localSettings.shrinkTime === 3}
                  >
                    <PolygonSvg className='number-polygon' />
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
                      checked={localSettings.difficulty[`${key}`]}
                      onChange={(event) =>
                        handleChange(event.target.name, {
                          ..._.mapValues(localSettings.difficulty, () => false),
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
                value={localSettings.circleColor}
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
                value={localSettings.circleSize}
                onChange={(event) => handleChange(event.target.name, event.target.value)}
              />
            </div>
          </div>
        </div>
      )}
      <div className='settings-item' style={{ paddingLeft: '5%' }}>
        <Circle styles={{ position: 'relative' }} localSettings={localSettings} />
      </div>
    </div>
  );
});

GameSettings.propTypes = {
  showSettings: PropTypes.bool,
  setShowSettings: PropTypes.func,
  setResetBtnDisabled: PropTypes.func,
  setSaveBtnDisabled: PropTypes.func,
};

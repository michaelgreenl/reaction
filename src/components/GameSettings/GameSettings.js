import React, { useState, useContext, forwardRef, useImperativeHandle, useEffect, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import { UserContext } from '../../hooks/UserContext';
import { Circle } from '../../components/Circle/Circle';
import { PolygonSvg } from '../../svgs/PolygonSvg';
import { CloseSvg } from '../../svgs/CloseSvg';
import './GameSettings.css';

const GameSettings = forwardRef(function GameSettings(props, ref) {
  // console.log('rendered');
  const _ = require('lodash');
  const { user, setUser } = useContext(UserContext);
  const { gameSettings } = user;
  const [localSettings, setLocalSettings] = useState(gameSettings);
  const causesResetSettings = ['shrinkTime', 'difficulty', 'circleSize'];
  const [enableScoreReset, setEnableScoreReset] = useState(false);

  useEffect(() => {
    if (!_.isEqual(localSettings, gameSettings)) {
      checkScoreReset();
      props.settingsChanged.current = true;
      props.setResetBtnDisabled(false);
      props.setSaveBtnDisabled(false);
    } else {
      setEnableScoreReset(false);
      props.settingsChanged.current = false;
      props.setResetBtnDisabled(true);
      props.setSaveBtnDisabled(true);
    }
  }, [localSettings]);

  const handleChange = useCallback((name, value) => {
    setLocalSettings({
      ...localSettings,
      [name]: value,
    });
  });

  const checkScoreReset = useCallback(() => {
    if (user.scores.length) {
      let toSet = false;
      for (const setting of causesResetSettings) {
        if (localSettings[setting] !== gameSettings[setting]) {
          toSet = true;
        }
      }
      setEnableScoreReset(toSet);
    }
  });

  const saveSettings = useCallback(
    (forceSave = false) =>
      new Promise((res, rej) => {
        if (!forceSave && enableScoreReset && !user.optOuts.saveGameSettingsWarning) {
          props.dispatchWarning({
            type: 'saveGameSettingsWarning',
            onClick1: () => {
              warnSaveGSonClick1();
              rej();
            },
            onClick2: () => warnSaveGSonClick2(() => res()),
          });
          props.setCurrWarning('saveGameSettingsWarning');
        } else {
          setUser({
            ...user,
            gameSettings: {
              ...localSettings,
            },
            scores: enableScoreReset ? [] : user.scores,
          });

          props.setResetBtnDisabled(true);
          props.setSaveBtnDisabled(true);
          props.settingsChanged.current = false;
          setEnableScoreReset(false);
          props.setCurrWarning(null);

          res();
        }
      }),
  );

  const resetSettings = useCallback(() => {
    props.settingsChanged.current = false;
    props.setResetBtnDisabled(true);
    props.setSaveBtnDisabled(true);
    setLocalSettings({
      ...gameSettings,
    });
  });

  const warnSaveGSonClick1 = useCallback(() => {
    props.setCurrWarning(null);
  });

  const warnSaveGSonClick2 = useCallback((res) => {
    saveSettings(true).then(
      () => {
        res();
      },
      () => {
        props.setCurrWarning(null);
      },
    );
  });

  useImperativeHandle(ref, () => {
    return {
      saveSettings,
      resetSettings,
    };
  });

  return (
    <div className='game-settings'>
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
      <div className='settings-item'>
        <Circle styles={{ position: 'relative' }} localSettings={localSettings} />
      </div>
    </div>
  );
});

GameSettings.propTypes = {
  showSettings: PropTypes.bool,
  settingsChanged: PropTypes.object,
  setShowSettings: PropTypes.func,
  setResetBtnDisabled: PropTypes.func,
  setSaveBtnDisabled: PropTypes.func,
  setGameActive: PropTypes.func,
  currWarning: PropTypes.string,
  setCurrWarning: PropTypes.func,
  dispatchWarning: PropTypes.func,
};

export default memo(GameSettings);

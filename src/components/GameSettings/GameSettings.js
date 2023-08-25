import React, {
  useState,
  useContext,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useCallback,
  useMemo,
  memo,
} from 'react';
import PropTypes from 'prop-types';
import { UserContext } from '../../hooks/UserContext';
import { Circle } from '../../components/Circle/Circle';
import { PolygonSvg } from '../../svgs/PolygonSvg';
import { Button } from '../Button/Button';
import { AnimatePresence, motion } from 'framer-motion';
import './GameSettings.css';

const GameSettings = forwardRef(function GameSettings(props, ref) {
  const _ = require('lodash');
  const { user, setUser } = useContext(UserContext);
  const { gameSettings } = user;
  const [localSettings, setLocalSettings] = useState(gameSettings);

  // Game settings that will affect the difficulty of the game.
  // If user changes one of these after playing a game, the scores will be reset.
  const causesResetSettings = ['shrinkTime', 'difficulty', 'circleSize'];
  const [enableScoreReset, setEnableScoreReset] = useState(false);

  useEffect(() => {
    // When the localSettings are changed, this checks if they are equal to the current user's gameSettings.
    if (!_.isEqual(localSettings, gameSettings)) {
      checkScoreReset();
      props.settingsChanged.current = true;
      props.setResetBtnDisabled(false);
      props.setSaveBtnDisabled(false);
    } else {
      // Sets enableScoreReset to false, as all settings are now equal to current user's gameSettings
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

  // If the user changes a setting, this checks if the user has played a game and the setting is in causesResetSettings.
  // If user it sets enableScoreReset to true.
  const checkScoreReset = useCallback(() => {
    if (user.scores.length) {
      let toSet = false;
      for (const setting of causesResetSettings) {
        // Since on of the settings is an object !_.isEqual(localSettings[setting], gameSettings[setting]) is also checked.
        if (
          localSettings[setting] !== gameSettings[setting] &&
          !_.isEqual(localSettings[setting], gameSettings[setting])
        ) {
          toSet = true;
        }
      }
      setEnableScoreReset(toSet);
    }
  });

  /*
    Saves settings using a promise in in the case that there are multiple modals and both of 
    the functionality needs to be executed asynchronously. 
  */
  const saveSettings = useCallback(
    (forceSave = false) =>
      new Promise((res, rej) => {
        /* 
          The 'saveGameSettingsWarning' will be dispatched if the score will be reset if the settings are changed due to a setting 
          that was changed, the user hasn't opted out of the warning, and force save hasn't be set to true.
          Force save will only be set to true by the warnSaveGSonClick2() since it needs to have a chance to bypass this warning.
        */
        if (!forceSave && enableScoreReset && !user.optOuts.saveGameSettingsWarning) {
          props.dispatchWarning({
            type: 'saveGameSettingsWarning',
            onClick1: () => {
              warnSaveGSonClick1();
              rej();
            },
            onClick2: () => warnSaveGSonClick2(() => res()),
          });
          props.currWarning.set('saveGameSettingsWarning');
        } else {
          // Saving settings
          setUser({
            ...user,
            gameSettings: {
              ...localSettings,
            },
            scores: enableScoreReset ? [] : user.scores,
          });

          // Resetting necessary state variables and executing res()
          props.setResetBtnDisabled(true);
          props.setSaveBtnDisabled(true);
          props.settingsChanged.current = false;
          setEnableScoreReset(false);
          props.currWarning.set(null);
          res();
        }
      }),
  );

  // Resets necessary state variables then resets localSettings
  const resetSettings = useCallback(() => {
    props.settingsChanged.current = false;
    props.setResetBtnDisabled(true);
    props.setSaveBtnDisabled(true);
    setLocalSettings({
      ...gameSettings,
    });
  });

  // onClick for 'Cancel' button in 'saveGameSettingsWarning' modal
  const warnSaveGSonClick1 = useCallback(() => {
    props.currWarning.set(null);
  });

  // onClick for 'Ok' button in 'saveGameSettingsWarning' modal
  const warnSaveGSonClick2 = useCallback((res) => {
    saveSettings(true).then(
      () => {
        res();
      },
      () => {
        props.currWarning.set(null);
      },
    );
  });

  // If the settings have been changed and not saved, and the user hasn't opted out, the 'closeGameSettingsWarning' warning is dispatched.
  // Else the settings are reset and the settings are closed.
  function checkCloseWarning() {
    if (props.settingsChanged.current && !user.optOuts.closeGameSettingsWarning) {
      props.dispatchWarning({
        type: 'closeGameSettingsWarning',
        onClick1: () => warnCloseGSonClick1(),
        onClick2: () => warnCloseGSonClick2(),
      });
      props.currWarning.set('closeGameSettingsWarning');
    } else {
      resetSettings();
      props.showSettings.set(false);
    }
  }

  // onClick for 'No' button in 'closeGameSettingsWarning' modal
  const warnCloseGSonClick1 = useCallback(() => {
    // resets settings, closes the modal, and exits settings
    resetSettings();
    props.currWarning.set(null);
    props.showSettings.set(false);
  });

  // onClick for 'Yes' button in 'closeGameSettingsWarning' modal
  const warnCloseGSonClick2 = useCallback(() => {
    // Saves settings then exits settings and the modal
    saveSettings().then(
      () => {
        props.showSettings.set(false);
        props.currWarning.set(null);
      },
      () => {
        props.showSettings.set(false);
        props.currWarning.set(null);
      },
    );
  });

  // Giving saveSettings() and resetSettings() back to Play.js
  useImperativeHandle(ref, () => {
    return {
      saveSettings,
      resetSettings,
    };
  });

  const settingsVariants = useMemo(() => {
    return {
      settingsDiv: {
        start: { height: 0, maxWidth: 0, minWidth: 0 },
        base: { height: 'auto', maxWidth: '50rem', minWidth: '50rem' },
        exit: { height: 0, maxWidth: 0, minWidth: 0 },
      },
      circle: {
        start: { opacity: 0, x: -300 },
        base: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 0 },
      },
    };
  });

  return (
    <div className='game-settings'>
      <AnimatePresence>
        {props.mainAnims && props.showSettings.get && (
          <motion.div
            className='settings-item'
            key='settingsDiv'
            initial={'start'}
            animate={'base'}
            variants={settingsVariants.settingsDiv}
            exit={'exit'}
            style={{ overflow: 'hidden' }}
          >
            <div className='settings'>
              <header className='settings-header'>
                <h3 className='header-text'>Settings</h3>
                <Button
                  className='close-button'
                  svgClassName='close-button-svg'
                  svgInitial='open'
                  svgInitialPath='M67.5 7.5L7.59623 67.4982M7.5 7.5L67.402 67.5'
                  viewBox='0 0 75 75'
                  onClick={() => checkCloseWarning()}
                />
              </header>
              <hr className='settings-break' />
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
                      // Decrement shrinkTime
                      onClick={() => handleChange('shrinkTime', localSettings.shrinkTime - 0.5)}
                      disabled={localSettings.shrinkTime === 0.5}
                    >
                      <PolygonSvg className='number-polygon' />
                    </button>
                    <button
                      className='number-arrow'
                      style={{ transform: 'translate(-1px, -15px) rotate(90deg)' }}
                      // Increment shrinkTime
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
                        {/* Capitalizing label */}
                        {key.charAt(0).toUpperCase()}
                        {key.slice(1)}
                      </label>
                      <input
                        className='radio-input'
                        name='difficulty'
                        type='radio'
                        value={key}
                        checked={localSettings.difficulty[`${key}`]}
                        // mapping object to get checked target
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
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {props.mainAnims && (
          <motion.div
            key='circle'
            className='settings-item'
            initial={'start'}
            animate={'base'}
            variants={settingsVariants.circle}
            exit={'exit'}
            transition={{ type: 'spring', bounce: 0.4, duration: 0.4 }}
          >
            <Circle className='settings-circle' localSettings={localSettings} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

GameSettings.propTypes = {
  mainAnims: PropTypes.bool,
  settingsChanged: PropTypes.object,
  showSettings: PropTypes.object,
  currWarning: PropTypes.object,
  dispatchWarning: PropTypes.func,
  setResetBtnDisabled: PropTypes.func,
  setSaveBtnDisabled: PropTypes.func,
};

export default memo(GameSettings);

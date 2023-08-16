import React, { useState, useContext, useRef, useCallback, useReducer } from 'react';
import './Play.css';
import { UserContext } from '../../hooks/UserContext';
import { warningReducer } from '../../hooks/warningReducer';
import Navbar from '../../components/Navbar/Navbar';
import { Button } from '../../components/Button/Button';
import GameSettings from '../../components/GameSettings/GameSettings';
import { PlayTilLose } from '../../components/Games/PlayTilLose';
import Modal from '../../components/Modal/Modal';
import { Scores } from '../../components/Scores/Scores';

function Play() {
  const { user } = useContext(UserContext);
  const [gameActive, setGameActive] = useState(false);
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [warning, dispatchWarning] = useReducer(warningReducer, {});
  const [currWarning, setCurrWarning] = useState(null);
  const gameSettingsRef = useRef(null);
  const settingsChanged = useRef(false);
  const [showSettings, setShowSettings] = useState(false);
  const [resetBtnDisabled, setResetBtnDisabled] = useState(true);
  const [saveBtnDisabled, setSaveBtnDisabled] = useState(true);

  const checkStartSettings = () => {
    // If the settings are changed and the user is starting a game, warning is dispatched
    if (settingsChanged.current) {
      dispatchWarning({
        type: 'startGameSettingsWarning',
        onClick1: () => warnStartGSonClick1(),
        onClick2: () => warnStartGSonClick2(),
        onClick3: () => warnStartGSonClick3(),
      });
      setCurrWarning('startGameSettingsWarning');
    } else {
      setGameActive(true);
    }
  };

  // onClick for 'Cancel' button in 'startGameSettingsWarning' modal
  const warnStartGSonClick1 = useCallback(() => {
    // Removes the current warning state, which removes the modal from the screen
    setCurrWarning(null);
  });

  // onClick for 'No' button in 'startGameSettingsWarning' modal
  const warnStartGSonClick2 = useCallback(() => {
    // Resets the settings, then removes the modal and starts the game
    gameSettingsRef.current.resetSettings();
    setCurrWarning(null);
    setGameActive(true);
  });

  // onClick for 'Yes' button in 'startGameSettingsWarning' modal
  const warnStartGSonClick3 = useCallback(() => {
    // Saves the settings, then removes the modal and starts the game or just removes the modal
    // The res() function can also be executed after a second modal is deployed.
    gameSettingsRef.current.saveSettings().then(
      () => {
        setCurrWarning(null);
        setGameActive(true);
      },
      () => {
        setCurrWarning(null);
      },
    );
  });

  // Resetting all things necessary for ending the game
  const endGame = () => {
    setGameActive(false);
    setShowEndScreen(true);
    setShowSettings(false);
  };

  // Showing the settings if the user clicks 'show settings' on the end screen
  const endSetActiveSettings = () => {
    setShowEndScreen(false);
    setShowSettings(true);
  };

  return (
    <div className='play'>
      <Navbar />
      {currWarning && (
        <Modal
          header={warning[`${currWarning}`].header}
          message={warning[`${currWarning}`].message}
          optOutOption={warning[`${currWarning}`].optOutOption}
          buttons={warning[`${currWarning}`].buttons}
        />
      )}
      {!gameActive ? (
        <main className='main'>
          {user.scores.length > 0 && !showSettings && <Scores />}
          {!showEndScreen ? (
            <>
              <GameSettings
                ref={gameSettingsRef}
                settingsChanged={settingsChanged}
                showSettings={{ get: showSettings, set: (toSet) => setShowSettings(toSet) }}
                currWarning={{ get: currWarning, set: (toSet) => setCurrWarning(toSet) }}
                dispatchWarning={dispatchWarning}
                setResetBtnDisabled={setResetBtnDisabled}
                setSaveBtnDisabled={setSaveBtnDisabled}
              />
              <div className={`play-buttons ${showSettings ? 'play-buttons-margin' : undefined}`}>
                {showSettings ? (
                  <>
                    <Button
                      className='play-button'
                      text='Reset'
                      onClick={() => gameSettingsRef.current.resetSettings()}
                      disabled={resetBtnDisabled}
                    />
                    <Button
                      className='play-button'
                      text='Save'
                      onClick={() => gameSettingsRef.current.saveSettings()}
                      disabled={saveBtnDisabled}
                    />
                  </>
                ) : (
                  <Button className='play-button' text='Settings' onClick={() => setShowSettings(!showSettings)} />
                )}
                <Button className='play-button' text='Start' onClick={() => checkStartSettings()} />
              </div>
            </>
          ) : (
            <div className='end-stats'>
              <span className='end-score'>{user.scores[user.scores.length - 1]}</span>
              <div className='play-buttons'>
                <Button className='play-button' text='Settings' onClick={() => endSetActiveSettings()} />
                <Button className='play-button' text='Play Again' onClick={() => setGameActive(true)} />
              </div>
            </div>
          )}
        </main>
      ) : (
        <PlayTilLose endGame={endGame} />
      )}
    </div>
  );
}

export default Play;

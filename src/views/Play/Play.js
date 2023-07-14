import React, { useState, useContext, useRef, useCallback, useReducer } from 'react';
import './Play.css';
import { UserContext } from '../../hooks/UserContext';
import { warningReducer } from '../../hooks/warningReducer';
import Navbar from '../../components/Navbar/Navbar';
import { Button } from '../../components/Button/Button';
import GameSettings from '../../components/GameSettings/GameSettings';
import { PlayTilLose } from '../../components/Games/PlayTilLose';
import Modal from '../../components/Modal/Modal';

function Play() {
  const { user } = useContext(UserContext);
  const [gameActive, setGameActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [resetBtnDisabled, setResetBtnDisabled] = useState(true);
  const [saveBtnDisabled, setSaveBtnDisabled] = useState(true);
  const gameSettingsRef = useRef(null);
  const settingsChanged = useRef(false);
  const [warning, dispatchWarning] = useReducer(warningReducer, {});
  const [currWarning, setCurrWarning] = useState(null);

  const checkStartSettings = () => {
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

  const warnStartGSonClick1 = useCallback(() => {
    setCurrWarning(null);
  });

  const warnStartGSonClick2 = useCallback(() => {
    gameSettingsRef.current.resetSettings();
    setCurrWarning(null);
    setGameActive(true);
  });

  const warnStartGSonClick3 = useCallback(() => {
    gameSettingsRef.current.saveSettings(true);
    if (currWarning === 'startGameSettingsWarning') {
      setCurrWarning(null);
    }
  });

  const endGame = () => {
    setGameActive(false);
    setShowEndScreen(true);
    setShowSettings(false);
  };

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
        <main
          className='main'
          style={{
            justifyContent: `${user.scores.length > 1 && !showSettings ? 'flex-start' : 'center'}`,
            gap: `${showSettings ? '5%' : '0'}`,
          }}
        >
          {user.scores.length > 1 && !showSettings && (
            <div className='all-scores'>
              <h2 className='scores-header'>Scores</h2>
              <ul className='scores'>
                {user.scores.map((score, i) => (
                  <li key={i} className='score'>
                    {score}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {!showEndScreen ? (
            <>
              <GameSettings
                ref={gameSettingsRef}
                showSettings={showSettings}
                settingsChanged={settingsChanged}
                setShowSettings={setShowSettings}
                setResetBtnDisabled={setResetBtnDisabled}
                setSaveBtnDisabled={setSaveBtnDisabled}
                setGameActive={setGameActive}
                setCurrWarning={setCurrWarning}
                dispatchWarning={dispatchWarning}
              />
              <div className='play-buttons'>
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

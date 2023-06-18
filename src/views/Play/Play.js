import React, { useState, useContext, useRef } from 'react';
import './Play.css';
import { UserContext } from '../../hooks/UserContext';
import { Navbar } from '../../components/Navbar/Navbar';
import { Button } from '../../components/Button/Button';
import { GameSettings } from '../../components/GameSettings/GameSettings';
import { PlayTilLose } from '../../components/Games/PlayTilLose';

function Play() {
  const { user } = useContext(UserContext);
  const [gameActive, setGameActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [resetBtnDisabled, setResetBtnDisabled] = useState(true);
  const [saveBtnDisabled, setSaveBtnDisabled] = useState(true);
  const gameSettingsRef = useRef(null);

  function setActiveGame() {
    setGameActive(false);
    setShowEndScreen(true);
    setShowSettings(false);
  }

  function endSetActiveSettings() {
    setShowEndScreen(false);
    setShowSettings(true);
  }

  return (
    <div className='play'>
      <Navbar />
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
                setShowSettings={setShowSettings}
                setResetBtnDisabled={setResetBtnDisabled}
                setSaveBtnDisabled={setSaveBtnDisabled}
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
                      onClick={() => gameSettingsRef.current.checkWarning()}
                      disabled={saveBtnDisabled}
                    />
                  </>
                ) : (
                  <Button className='play-button' text='Settings' onClick={() => setShowSettings(!showSettings)} />
                )}
                <Button className='play-button' text='Start' onClick={() => setGameActive(true)} />
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
        <PlayTilLose setActiveGame={setActiveGame} />
      )}
    </div>
  );
}

export default Play;

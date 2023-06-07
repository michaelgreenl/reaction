import React, { useState } from 'react';
import './Play.css';
import { Navbar } from '../../components/Navbar/Navbar';
import { Button } from '../../components/Button/Button';
import { GameSettings } from '../../components/GameSettings/GameSettings';
import { Circle } from '../../components/Circle/Circle';
import { PlayTilLose } from '../../components/Games/PlayTilLose';

function Play() {
  const [gameActive, setGameActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  function setActiveSettings() {
    setGameActive(false);
    setShowSettings(true);
  }

  return (
    <div className='play'>
      <Navbar />
      {!gameActive ? (
        <main className='main' style={showSettings ? { gap: '5%' } : undefined}>
          <div className='settings'>
            {showSettings && (
              <div className='settings-item'>
                <GameSettings />
              </div>
            )}
            <div className='settings-item' style={{ paddingLeft: '5%' }}>
              <Circle styles={{ position: 'relative' }} />
            </div>
          </div>
          <div className='start-buttons'>
            {showSettings ? (
              <Button className='start-button' text='Save' onClick={() => setShowSettings(!showSettings)} />
            ) : (
              <Button className='start-button' text='Settings' onClick={() => setShowSettings(!showSettings)} />
            )}
            <Button className='start-button' text='Start' onClick={() => setGameActive(!gameActive)} />
          </div>
        </main>
      ) : (
        <PlayTilLose showSettings={setActiveSettings} />
      )}
    </div>
  );
}

export default Play;

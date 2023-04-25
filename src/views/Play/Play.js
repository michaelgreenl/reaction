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
            <div className='settings-item'>
              <Circle position={{ top: 50, right: 45 }} />
            </div>
          </div>
          <div className='buttons'>
            {showSettings ? (
              <Button text='Save' styling={{ fontSize: '1.2em' }} onClick={() => setShowSettings(!showSettings)} />
            ) : (
              <Button text='Settings' styling={{ fontSize: '1.2em' }} onClick={() => setShowSettings(!showSettings)} />
            )}
            <Button text='Start' styling={{ fontSize: '1.2em' }} onClick={() => setGameActive(!gameActive)} />
          </div>
        </main>
      ) : (
        <PlayTilLose />
      )}
    </div>
  );
}

export default Play;

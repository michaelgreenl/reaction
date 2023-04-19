import React, { useState } from 'react';
import './Play.css';
import { Navbar } from '../../components/Navbar/Navbar';
import { Button } from '../../components/Button/Button';
import { GameSettings } from '../../components/GameSettings/GameSettings';
import { Circle } from '../../components/Circle/Circle';

function Play() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className='play'>
      <Navbar />
      <main className='main' style={showSettings ? { gap: '5%' } : undefined}>
        <div className='settings'>
          {showSettings && (
            <div className='settings-item'>
              <GameSettings />
            </div>
          )}
          <div className='settings-item'>
            <Circle />
          </div>
        </div>
        <div className='buttons'>
          {showSettings && (
            <Button text='Save' styling={{ fontSize: '1.2em' }} onClick={() => setShowSettings(!showSettings)} />
          )}
          {!showSettings && (
            <Button text='Settings' styling={{ fontSize: '1.2em' }} onClick={() => setShowSettings(!showSettings)} />
          )}
          <Button text='Start' styling={{ fontSize: '1.2em' }} />
        </div>
      </main>
    </div>
  );
}

export default Play;

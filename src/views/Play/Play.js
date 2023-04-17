import React from 'react';
import './Play.css';
import { Navbar } from '../../components/Navbar/Navbar';
import { Button } from '../../components/Button/Button';
import { GameSettings } from '../../components/GameSettings/GameSettings';
import { Circle } from '../../components/Circle/Circle';

function Play() {
  return (
    <div className='play'>
      <Navbar />
      <main className='main'>
        <div className='start-buttons'>
          <GameSettings />
          <Button text='Settings' />
          <Button text='Start' />
        </div>
        <Circle />
      </main>
    </div>
  );
}

export default Play;

import React, { useContext, useEffect, useState } from 'react';
import './Games.css';
import { UserContext } from '../../hooks/UserContext';
import { useTimer } from '../../hooks/useTimer';
import { random } from 'lodash';
import { Circle } from '../Circle/Circle';
import { Button } from '../Button/Button';

export const PlayTilLose = () => {
  const [circles, setCircles] = useState([]);
  const [currScore, setCurrScore] = useState(0);
  const [genTime, setGenTime] = useState(0);
  const [circleCount, setCircleCount] = useState(0);
  const [gameActive, setGameActive] = useState(true);
  const { user, setUser } = useContext(UserContext);
  const { gameSettings } = user;

  useEffect(() => {
    if (gameSettings.difficulty.easy) setGenTime(2.5);
    if (gameSettings.difficulty.medium) setGenTime(1.25);
    if (gameSettings.difficulty.hard) setGenTime(0.75);
  }, []);

  const { timer, resetTimer } = useTimer(genTime, 0.01);

  useEffect(() => {
    if (timer && gameActive) {
      resetTimer();
      generateCircle();
    } else if (!gameActive) {
      resetTimer();
    }
  }, [timer, gameActive]);

  function generateCircle() {
    const position = {
      top: random(2, 85),
      right: random(2, 85),
    };

    // Making sure the circle never touches the score
    if (position.top <= 6 && position.right <= 6) {
      position.right = 8;
    }

    setCircles(
      [
        ...circles,
        {
          key: circleCount,
          styles: { top: `${position.top}%`, right: `${position.right}%` },
        },
      ],
      setCircleCount((c) => c + 1),
    );
  }

  function circleClick(key) {
    setCurrScore(currScore + 1);
    setCircles(circles.filter((circle) => circle.key !== key));
  }

  function gameLostListener(toSet) {
    setGameActive(toSet);
    setCircles([]);
    setUser({
      ...user,
      scores: [...user.scores, currScore],
    });
    setCurrScore(0);
  }

  return (
    <div className='canvas'>
      {gameActive ? (
        <>
          <span className='score'>{currScore}</span>
          {circles.map((circle) => (
            <Circle
              key={circle.key}
              onClick={() => circleClick(circle.key)}
              styles={circle.styles}
              useTransition={true}
              animationEnd={gameLostListener}
            />
          ))}
        </>
      ) : (
        <div className='end-screen'>
          <span className='score'>{user.scores[user.scores.length - 1]}</span>
          <div className='end-buttons'>
            <Button text='Settings' styling={{ fontSize: '1.2em' }} />
            <Button text='Play Again' styling={{ fontSize: '1.2em' }} onClick={() => setGameActive(true)} />
          </div>
        </div>
      )}
    </div>
  );
};

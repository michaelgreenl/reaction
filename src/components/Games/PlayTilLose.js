import React, { useContext, useEffect, useState } from 'react';
import './Games.css';
import PropTypes from 'prop-types';
import { UserContext } from '../../hooks/UserContext';
import { useTimer } from '../../hooks/useTimer';
import { random } from 'lodash';
import { Circle } from '../Circle/Circle';
import { motion } from 'framer-motion';

export const PlayTilLose = (props) => {
  const { user, setUser } = useContext(UserContext);
  const { gameSettings } = user;
  const [circles, setCircles] = useState([]);
  const [currScore, setCurrScore] = useState(0);
  const [circleCount, setCircleCount] = useState(0);

  // useEffect(() => generateCircle(), []);

  const { timerComplete, resetTimer, stopwatchTime } = useTimer({
    timeVal: gameSettings.difficulty.easy
      ? 2.5
      : gameSettings.difficulty.medium
      ? 1.25
      : gameSettings.difficulty.hard
      ? 0.75
      : null,
  });

  useEffect(() => {
    // If the timer hook returns true the timer has reached 0 and a new circle should be generated.
    if (timerComplete) {
      resetTimer();
      generateCircle();
    }
  }, [timerComplete]);

  function generateCircle() {
    // Creating a random position for the circle
    const position = {
      top: random(2, 85),
      right: random(2, 85),
    };

    // Making sure the circle never touches the score
    if (position.top <= 6 && position.right <= 6) {
      position.right = 8;
    }

    // Adding circle to 'circles' and incrementing circle count for the key
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
    // Incrementing score and removing circle that was clicked from 'circles'
    setCurrScore(currScore + 1);
    setCircles(circles.filter((circle) => circle.key !== key));
  }

  function gameLostListener() {
    props.endGame();
    setCircles([]);
    setUser({
      ...user,
      scores: [...user.scores, { score: currScore, time: stopwatchTime }],
    });
    setCurrScore(0);
    setCircleCount(0);
  }

  return (
    <div className='canvas'>
      <motion.div
        className='curr-game-stats'
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        onAnimationComplete={() => generateCircle()}
      >
        <div className='game-stats'>
          <div className='game-stat-cont'>
            <h2 className='game-stat-head'>Score:</h2>
            <span className='game-stat'>{currScore}</span>
          </div>
          <div className='game-stat-cont'>
            <h2 className='game-stat-head'>Time:</h2>
            <span className='game-stat'>{stopwatchTime}</span>
          </div>
        </div>
        <hr className='game-stat-break' />
      </motion.div>
      {circles.map((circle) => (
        <Circle
          key={circle.key}
          onClick={() => circleClick(circle.key)}
          styles={circle.styles}
          useTransition={true}
          animationEnd={gameLostListener}
        />
      ))}
    </div>
  );
};

PlayTilLose.propTypes = {
  endGame: PropTypes.func,
};

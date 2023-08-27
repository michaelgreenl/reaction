import React, { useContext, useEffect, useState } from 'react';
import './Games.css';
import PropTypes from 'prop-types';
import { UserContext } from '../../hooks/UserContext';
import { useTimer } from '../../hooks/useTimer';
import { random } from 'lodash';
import { Circle } from '../Circle/Circle';

export const PlayTilLose = (props) => {
  const { user, setUser } = useContext(UserContext);
  const { gameSettings } = user;
  const [circles, setCircles] = useState([]);
  const [currScore, setCurrScore] = useState(0);
  const [circleCount, setCircleCount] = useState(0);

  useEffect(() => generateCircle(), []);

  const { timerComplete, resetTimer } = useTimer({
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
      scores: [...user.scores, currScore],
    });
    setCurrScore(0);
    setCircleCount(0);
  }

  return (
    <div className='canvas'>
      <span className='curr-score'>{currScore}</span>
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

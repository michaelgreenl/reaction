/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import './Games.css';
import PropTypes from 'prop-types';
import { UserContext } from '../../hooks/UserContext';
import { useTimer } from '../../hooks/useTimer';
import { random } from 'lodash';
import { Circle } from '../Circle/Circle';
import { AnimatePresence, motion } from 'framer-motion';

export const PlayTilLose = (props) => {
  const { REACT_APP_API_URL } = process.env;
  const { user, setUser, userRef } = useContext(UserContext);
  const { gameSettings } = user;
  const [circles, setCircles] = useState([]);
  const [currScore, setCurrScore] = useState(0);
  const [circleCount, setCircleCount] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);

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
    if (timerComplete && !gameEnded) {
      resetTimer();
      generateCircle();
    }
  }, [timerComplete]);

  function generateCircle() {
    // Creating a random position for the circle
    const position = {
      top: random(7, 85),
      right: random(2, 83),
    };

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

  useEffect(() => {
    if (gameEnded) {
      // Setting the user's games before posting the games since the updated state is needed immediately
      setUser({
        ...user,
        games: [
          // Added createdAt property so if user goes to profile without refreshing, the date and time will be there.
          { score: currScore, time: stopwatchTime, createdAt: new Date(Date.now()).toISOString() },
          ...user.games,
        ],
      });
      postGame();
    }
  }, [gameEnded]);

  function postGame() {
    if (user.isLoggedIn) {
      fetch(`${REACT_APP_API_URL}/game`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          statsId: user.statsId,
          userId: user.userId,
          score: currScore,
          time: stopwatchTime,
          stats: user.stats,
        }),
      })
        .then(async (res) => {
          if (!res.ok) {
            const err = await res.json();
            if (err.message) {
              throw new Error(err.message);
            }
            throw new Error('ERROR');
          }
          return res.json();
        })
        .then((data) => {
          setUser({
            ...userRef.current,
            stats: {
              totalGames: data.totalGames,
              highScore: data.highScore,
              highTime: data.highTime,
            },
          });
          window.localStorage.setItem(
            'USER',
            JSON.stringify({
              ...userRef.current,
            }),
          );
          setCurrScore(0);
          setCircleCount(0);
        });
    } else {
      let { highScore, totalGames, highTime } = user.stats;

      const updatedStats = {
        totalGames: totalGames + 1,
        highScore: currScore > highScore ? currScore : highScore,
        highTime: parseFloat(stopwatchTime, 10) > highTime ? parseFloat(stopwatchTime, 10) : highTime,
      };

      setUser({
        ...userRef.current,
        stats: { ...updatedStats },
      });

      window.localStorage.setItem(
        'USER',
        JSON.stringify({
          ...userRef.current,
        }),
      );
      setCurrScore(0);
      setCircleCount(0);
    }
  }

  return (
    <div className='canvas'>
      <AnimatePresence onExitComplete={() => props.endGame()}>
        {!gameEnded && (
          <motion.div
            className='curr-game-stats'
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
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
        )}
      </AnimatePresence>
      {circles.map((circle) => (
        <Circle
          key={circle.key}
          onClick={() => circleClick(circle.key)}
          styles={circle.styles}
          useTransition={true}
          animationEnd={setGameEnded}
          gameEnded={gameEnded}
        />
      ))}
    </div>
  );
};

PlayTilLose.propTypes = {
  endGame: PropTypes.func,
};

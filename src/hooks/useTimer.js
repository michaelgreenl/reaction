import { useEffect, useState } from 'react';
import propTypes from 'prop-types';

export const useTimer = ({ timeVal }) => {
  const [timerComplete, setTimerComplete] = useState(false);
  const [time, setTime] = useState(timeVal);
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    let timerInterval = setInterval(() => {
      if (time <= 0) {
        setTimerComplete(true);
      } else {
        // Getting the current elapsed time based on the current time, set to seconds by dividing by 1000
        // Then subtracting the elapsed time from the timer's original set time
        setTime(Number(timeVal - (Date.now() - startTime) / 1000));
      }
    }, 10);
    return () => {
      clearInterval(timerInterval);
    };
  });

  function resetTimer() {
    setStartTime(Date.now());
    setTimerComplete(false);
    setTime(timeVal);
  }

  return { timerComplete, time, resetTimer };
};

useTimer.propTypes = {
  time: propTypes.number,
  increment: propTypes.number,
};

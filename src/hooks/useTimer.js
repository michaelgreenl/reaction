import { useEffect, useState, useRef } from 'react';
import propTypes from 'prop-types';

export const useTimer = ({ timeVal }) => {
  const [timerComplete, setTimerComplete] = useState(false);
  const [timerTime, setTimerTime] = useState(timeVal);
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const startTime = useRef(Date.now());
  const [timerStartTime, setTimerStartTime] = useState(Date.now());

  useEffect(() => {
    let timerInterval = setInterval(() => {
      if (timerTime <= 0) {
        setTimerComplete(true);
      } else {
        // Getting the current elapsed time based on the current time, set to seconds by dividing by 1000
        // Then subtracting the elapsed time from the timer's original set time
        setTimerTime(Number(timeVal - (Date.now() - timerStartTime) / 1000));
        setStopwatchTime(Number((Date.now() - startTime.current) / 1000).toFixed(2));
      }
    }, 10);
    return () => {
      clearInterval(timerInterval);
    };
  });

  function resetTimer() {
    setTimerStartTime(Date.now());
    setTimerComplete(false);
    setTimerTime(timeVal);
  }

  return { timerComplete, resetTimer, stopwatchTime };
};

useTimer.propTypes = {
  time: propTypes.number,
  increment: propTypes.number,
};

import { useEffect, useState } from 'react';
import propTypes from 'prop-types';

export const useTimer = (timeVal, increment) => {
  const [timer, setTimer] = useState(false);
  const [time, setTime] = useState(timeVal);

  useEffect(() => {
    let timer = setInterval(() => {
      if (time <= 0) {
        // If the timer is <= 0 than set the timer to 0, then we can reset the timer using resetTimer()
        setTimer(true);
      } else {
        // If the timer is above 0, continue to decrement the timer and return false.
        setTime(Number(time - increment).toFixed(2));
        return false;
      }
    }, 10);
    return () => {
      clearInterval(timer);
    };
  });

  function resetTimer() {
    setTimer(false);
    setTime(timeVal);
  }

  return { timer, time, resetTimer };
};

useTimer.propTypes = {
  time: propTypes.number,
  increment: propTypes.number,
};

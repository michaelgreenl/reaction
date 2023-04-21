import { useEffect, useState } from 'react';
import propTypes from 'prop-types';

export const useTimer = (timeVal, increment) => {
  const [timer, setTimer] = useState(false);
  const [time, setTime] = useState(timeVal);

  useEffect(() => {
    let timer = setInterval(() => {
      if (time <= 0) {
        setTimer(true);
      } else {
        setTime(Number(time - increment).toFixed(2));
        return false;
      }
    }, 10);
    return () => {
      clearInterval(timer);
    };
  });

  function reset() {
    setTimer(false);
  }

  return { timer, time, reset };
};

useTimer.propTypes = {
  time: propTypes.number,
  increment: propTypes.number,
};

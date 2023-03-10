import { useState } from 'react';

export const useGameSettings = (initValues) => {
  const [gameSettings, setGameSettings] = useState(initValues);

  return [
    gameSettings,
    (e) => {
      setGameSettings({
        ...gameSettings,
        [e.target.name]: e.target.value,
      });
    },
  ];
};

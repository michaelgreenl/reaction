import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './views/Home/Home';
import Play from './views/Play/Play';
import Improve from './views/Improve/Improve';
import Contact from './views/Contact/Contact';
import { GameSettingsContext } from './hooks/GameSettingsContext';
import './App.css';

function App() {
  const [gameSettings, setGameSettings] = useState({
    circleColor: '#FFFFFF',
    circleSize: 100,
    shrinkTime: 2.0,
    showTime: true,
  });

  const providerValue = useMemo(() => ({ gameSettings, setGameSettings }), [gameSettings, setGameSettings]);

  return (
    <Router>
      <GameSettingsContext.Provider value={providerValue}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/play' element={<Play />} />
          <Route path='/improve' element={<Improve />} />
          <Route path='/contact' element={<Contact />} />
        </Routes>
      </GameSettingsContext.Provider>
    </Router>
  );
}

export default App;

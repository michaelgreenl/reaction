import React, { useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './views/Home/Home';
import Play from './views/Play/Play';
import Contact from './views/Contact/Contact';
import { UserContext } from './hooks/UserContext';
import { useStateRef } from './hooks/useStateRef';
import './App.css';

function App() {
  const [user, setUser, userRef] = useStateRef({
    val: {
      gameSettings: {
        shrinkTime: 2.0,
        difficulty: { easy: false, medium: true, hard: false },
        circleColor: '#FFFFFF',
        circleSize: 100,
      },
      scores: [],
      optOuts: {
        saveGameSettingsWarning: false,
        closeGameSettingsWarning: false,
      },
    },
  });

  const providerValue = useMemo(() => ({ user, setUser, userRef }), [user, setUser, userRef]);

  return (
    <Router>
      <UserContext.Provider value={providerValue}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/play' element={<Play />} />
          <Route path='/contact' element={<Contact />} />
        </Routes>
      </UserContext.Provider>
    </Router>
  );
}

export default App;

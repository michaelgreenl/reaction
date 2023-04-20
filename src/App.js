import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './views/Home/Home';
import Play from './views/Play/Play';
import Improve from './views/Improve/Improve';
import Contact from './views/Contact/Contact';
import { UserContext } from './hooks/UserContext';
import './App.css';

function App() {
  const [user, setUser] = useState({
    gameSettings: {
      circleColor: '#FFFFFF',
      circleSize: 100,
      shrinkTime: 2.0,
      showTime: true,
    },
    scores: [],
  });

  const providerValue = useMemo(() => ({ user, setUser }), [user, setUser]);

  return (
    <Router>
      <UserContext.Provider value={providerValue}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/play' element={<Play />} />
          <Route path='/improve' element={<Improve />} />
          <Route path='/contact' element={<Contact />} />
        </Routes>
      </UserContext.Provider>
    </Router>
  );
}

export default App;

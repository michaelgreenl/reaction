import React, { useMemo, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './views/Home/Home';
import Play from './views/Play/Play';
import Contact from './views/Contact/Contact';
import Auth from './views/Auth/Auth';
import Profile from './views/Profile/Profile';
import { UserContext } from './hooks/UserContext';
import { useStateRef } from './hooks/useStateRef';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser, userRef] = useStateRef({
    val: {
      token: null,
      isLoggedIn: false,
      userId: null,
      settingsId: null,
      statsId: null,
      username: null,
      gameSettings: {
        shrinkTime: 2.0,
        difficulty: { easy: false, medium: true, hard: false },
        circleColor: '#FFFFFF',
        circleSize: { range: 'md', px: 100 },
      },
      games: [],
      stats: {},
      optOuts: {
        saveGameSettingsWarning: false,
        closeGameSettingsWarning: false,
      },
    },
  });

  useEffect(() => {
    const currUser = JSON.parse(window.localStorage.getItem('USER'));
    if (currUser !== null) {
      setUser({
        ...currUser,
      });
    } else {
      window.localStorage.setItem('USER', JSON.stringify(userRef.current));
    }
    setIsLoading(false);
  }, []);

  const providerValue = useMemo(() => ({ user, setUser, userRef }), [user, setUser, userRef]);

  if (isLoading) {
    return <div>Loading</div>;
  }

  return (
    <Router>
      <UserContext.Provider value={providerValue}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/play' element={<Play />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/auth' element={!user.isLoggedIn ? <Auth /> : <Navigate to='/profile' />} />
          <Route path='/profile' element={user.isLoggedIn ? <Profile /> : <Navigate to='/auth' />} />
        </Routes>
      </UserContext.Provider>
    </Router>
  );
}

export default App;

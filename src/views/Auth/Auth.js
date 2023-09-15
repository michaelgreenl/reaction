import React, { useContext, useEffect, useState } from 'react';
import './Auth.css';
import { UserContext } from '../../hooks/UserContext';
import { Button } from '../../components/Button/Button';
import Navbar from '../../components/Navbar/Navbar';
import { LogoSvg } from '../../svgs/LogoSvg';
import { CautionSvg } from '../../svgs/CautionSvg';

function Auth() {
  const { user, setUser, userRef } = useContext(UserContext);
  const [isLoggingIn, setIsLoggingIn] = useState(true);
  const [warning, setWarning] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { REACT_APP_API_URL } = process.env;

  useEffect(() => {
    if (password !== confirmPassword) {
      setWarning('Passwords do not match');
    }
  }, [confirmPassword]);

  function handleCreateUser(e) {
    e.preventDefault();
    fetch(`${REACT_APP_API_URL}/users/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          setWarning(err.message);
          throw new Error('ERROR');
        }
        return res.json();
      })
      .then((data) => {
        setUser({
          ...user,
          token: data.token,
          userId: data.id,
          settingsId: data.settingsId,
          statsId: data.statsId,
          username: username,
          isLoggedIn: true,
        });
        window.localStorage.setItem('USER', JSON.stringify(userRef.current));
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function handleLogin(e) {
    e.preventDefault();
    fetch('http://localhost:3001/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          setWarning(err.message);
          throw new Error('ERROR');
        }
        return res.json();
      })
      .then((data) => {
        setUser({
          ...user,
          token: data.token,
          userId: data.id,
          settingsId: data.settingsId,
          statsId: data.statsId,
          username: username,
          isLoggedIn: true,
        });
        window.localStorage.setItem('USER', JSON.stringify(userRef.current));
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div className='auth'>
      <Navbar />
      <div className='auth-cont'>
        <header className='auth-header'>
          <LogoSvg className='header-logo-svg' />
          <h3 className='header-text'>{isLoggingIn ? 'Login' : 'Sign Up'}</h3>
        </header>
        <hr className='auth-break' />
        {warning && (
          <div className='warning-cont'>
            <CautionSvg className='caution-svg' />
            <span className='auth-warning'>{warning}</span>
          </div>
        )}
        <form className='auth-form' onSubmit={isLoggingIn ? (e) => handleLogin(e) : (e) => handleCreateUser(e)}>
          <div className='input-cont'>
            <label className='input-label' htmlFor='username'>
              Username
            </label>
            <input
              className='auth-input'
              name='username'
              type='text'
              value={username}
              required
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            ></input>
          </div>
          <div className='input-cont'>
            <label className='input-label' htmlFor='password'>
              Password
            </label>
            <input
              className='auth-input'
              name='password'
              type='password'
              value={password}
              required
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            ></input>
          </div>
          {!isLoggingIn && (
            <div className='input-cont'>
              <label className='input-label' htmlFor='confirmPassword'>
                Confirm Password
              </label>
              <input
                className='auth-input'
                name='confirmPassword'
                type='password'
                value={confirmPassword}
                required
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
              ></input>
            </div>
          )}
          <Button className='submit-button' type='submit' text={isLoggingIn ? 'Login' : 'Sign Up'} />
        </form>
        <footer className='auth-footer'>
          <span className='footer-text'>
            {isLoggingIn ? "Don't have an account yet?  " : 'Already have an account?  '}
          </span>
          <Button
            className='footer-button'
            onClick={() => setIsLoggingIn(!isLoggingIn)}
            text={isLoggingIn ? 'Sign up' : 'Login'}
          />
        </footer>
      </div>
    </div>
  );
}

export default Auth;

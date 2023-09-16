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
  const [warning, setWarning] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldWarning, setFieldWarning] = useState({ username: false, password: false, confirmPassword: false });

  const { REACT_APP_API_URL } = process.env;

  useEffect(() => {
    if (password !== confirmPassword) {
      setWarning('Passwords do not match');
      setFieldWarning({ ...fieldWarning, password: true, confirmPassword: true });
    } else {
      setWarning('');
      setFieldWarning({ ...fieldWarning, password: false, confirmPassword: false });
    }
  }, [confirmPassword]);

  useEffect(() => {
    setWarning('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setFieldWarning({ username: false, password: false, confirmPassword: false });
  }, [isLoggingIn]);

  function makeApiRequest(url, options) {
    return fetch(url, options)
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          setWarning(err.message);
          switch (res.status) {
            case 404:
            case 422:
              setFieldWarning({ ...fieldWarning, username: true });
              break;
            case 401:
              setFieldWarning({ ...fieldWarning, password: true });
              break;
          }
          throw new Error('ERROR');
        }
        return res.json();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function handleAuth(e) {
    e.preventDefault();
    const url = isLoggingIn ? `${REACT_APP_API_URL}/users/login` : `${REACT_APP_API_URL}/users/auth`;
    makeApiRequest(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    }).then((data) => {
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
        <form className='auth-form' onSubmit={(e) => handleAuth(e)}>
          <div className='input-cont'>
            <label className='input-label' htmlFor='username'>
              Username
            </label>
            <input
              className={`input-field ${fieldWarning.username ? 'auth-input-warning' : undefined}`}
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
              className={`input-field ${fieldWarning.password ? 'auth-input-warning' : undefined}`}
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
                className={`input-field ${fieldWarning.confirmPassword ? 'auth-input-warning' : undefined}`}
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
          <Button
            className='submit-button'
            type={password === confirmPassword || isLoggingIn ? 'submit' : 'button'}
            text={isLoggingIn ? 'Login' : 'Sign Up'}
          />
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

import React, { useContext } from 'react';
import { UserContext } from '../../hooks/UserContext';
import './Scores.css';
// import PropTypes from 'prop-types';

export const Scores = () => {
  const { user } = useContext(UserContext);

  return (
    <div className='scores'>
      <header className='scores-header'>
        <h2 className='scores-header-text'>Scores</h2>
      </header>
      <hr className='scores-break' />
      <ul className='score-list'>
        {user.scores.map((score, i) => (
          <li key={i} className='score'>
            <span>{score}</span>
            <span className='time'>0:00</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Scores.propTypes = {};

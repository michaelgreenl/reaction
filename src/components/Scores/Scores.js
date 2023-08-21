import React, { useContext, useEffect, useMemo, useState } from 'react';
import { UserContext } from '../../hooks/UserContext';
import './Scores.css';
import { Button } from '../Button/Button';
import { usePresence, useAnimation, motion } from 'framer-motion';
// import PropTypes from 'prop-types';

export const Scores = () => {
  const { user } = useContext(UserContext);
  const [isPresent, safeToRemove] = usePresence();
  const divControls = useAnimation();
  const closeBtnControls = useAnimation();
  const [scoresDiv, setScoresDiv] = useState('closed');

  useEffect(() => {
    // If the div is open, closed, and if component is getting removed from the dom tree
    if (isPresent && scoresDiv === 'closed') {
      divControls.start('closed');
      closeBtnControls.start('closed');
    } else if (isPresent && scoresDiv === 'open') {
      divControls.start('open');
      closeBtnControls.start('open');
    } else {
      divControls.start('exit').then(() => safeToRemove());
    }
  }, [isPresent, scoresDiv]);

  // Variants for the scores div motion elements
  const scoresDivVariants = useMemo(() => {
    return {
      div: {
        open: { maxHeight: '30%', width: '20rem', x: 0 },
        closed: { maxHeight: '7rem', width: '16.75rem', x: 0 },
        exit: { maxHeight: '7rem', width: '16.75rem', x: -300 },
      },
      svgs: {
        open: { d: 'M67.5 7.5L7.59623 67.4982M7.5 7.5L67.402 67.5' },
        closed: { d: 'M67.5 22.5L37.5 52.5M7.5 22.5L37.5481 52.5', rotate: -90 },
      },
    };
  });

  // Setting the scores div state to open or closed when the close button is clicked
  function onCloseClick() {
    setScoresDiv(scoresDiv === 'open' ? 'closed' : 'open');
  }

  return (
    <motion.div
      className='scores'
      initial={scoresDivVariants.div.exit}
      animate={divControls}
      variants={scoresDivVariants.div}
      transition={{ type: 'spring', bounce: 0.25, duration: 0.4 }}
    >
      <header className='scores-header'>
        <h2 className='scores-header-text'>Scores</h2>
        <Button
          className='close-button'
          svgClassName='close-button-svg'
          viewBox='0 0 75 75'
          svgInitial={scoresDivVariants.svgs.closed.d}
          svgAnimate={closeBtnControls}
          svgVariants={scoresDivVariants.svgs}
          svgTransition={{ duration: 0.25, ease: 'easeInOut' }}
          onClick={() => onCloseClick()}
        />
      </header>
      <hr className='scores-break' />
      {/* Making the scroll bar thumb transparent during the dropdown closing */}
      <ul className={`score-list ${scoresDiv === 'closed' ? 'transparent-scroll' : undefined}`}>
        {user.scores.map((score, i) => (
          <li key={i} className='score'>
            <span>{score}</span>
            <span className='time'>0:00</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

// Scores.propTypes = {};

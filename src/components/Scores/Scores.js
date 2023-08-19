import React, { useContext, useMemo, useState } from 'react';
import { UserContext } from '../../hooks/UserContext';
import './Scores.css';
import { Button } from '../Button/Button';
import { motion } from 'framer-motion';
// import PropTypes from 'prop-types';

export const Scores = () => {
  const { user } = useContext(UserContext);

  // Close button state and animation states
  const [closeButton, setCloseButton] = useState('closed');
  const closeButtonVariants = useMemo(() => {
    return {
      div: {
        open: { maxHeight: '30%', width: '20rem' },
        closed: { maxHeight: '7rem', width: '16.75rem' },
      },
      svgs: {
        open: { d: 'M67.5 7.5L7.59623 67.4982M7.5 7.5L67.402 67.5' },
        closed: { d: 'M67.5 22.5L37.5 52.5M7.5 22.5L37.5481 52.5', rotate: -90 },
      },
    };
  });

  function onCloseClick() {
    // Setting the close button to the correct svg
    setCloseButton(closeButton === 'open' ? 'closed' : 'open');
  }

  return (
    <motion.div
      className='scores'
      initial={closeButtonVariants.div.closed}
      animate={closeButton}
      variants={closeButtonVariants.div}
    >
      <header className='scores-header'>
        <h2 className='scores-header-text'>Scores</h2>
        <Button
          className='close-button'
          svgClassName='close-button-svg'
          viewBox='0 0 75 75'
          svgInitial={closeButtonVariants.svgs.closed.d}
          svgAnimate={closeButton}
          svgVariants={closeButtonVariants.svgs}
          svgTransition={{ duration: 0.25, ease: 'easeInOut' }}
          onClick={() => onCloseClick()}
        />
      </header>
      <hr className='scores-break' />
      {/* Making the scroll bar thumb transparent during the dropdown closing */}
      <ul className={`score-list ${closeButton === 'closed' ? 'transparent-scroll' : undefined}`}>
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

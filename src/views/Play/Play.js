import React, { useState, useContext, useRef, useCallback, useReducer, useEffect, useMemo } from 'react';
import './Play.css';
import { UserContext } from '../../hooks/UserContext';
import Navbar from '../../components/Navbar/Navbar';
import { Button } from '../../components/Button/Button';
import GameSettings from '../../components/GameSettings/GameSettings';
import { PlayTilLose } from '../../components/Games/PlayTilLose';
import Modal from '../../components/Modal/Modal';
import { Scores } from '../../components/Scores/Scores';
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';
import Footer from '../../components/Footer/Footer';

function Play() {
  const { REACT_APP_API_URL } = process.env;
  const { user, setUser, userRef } = useContext(UserContext);
  const [gameActive, setGameActive] = useState(false);
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [warning, dispatchWarning] = useReducer(warningReducer, {});
  const [currWarning, setCurrWarning] = useState(null);
  const gameSettingsRef = useRef(null);
  const settingsChanged = useRef(false);
  const [showSettings, setShowSettings] = useState(false);
  const [resetBtnDisabled, setResetBtnDisabled] = useState(true);
  const [saveBtnDisabled, setSaveBtnDisabled] = useState(true);
  const [mainAnims, setMainAnims] = useState(true);
  const isInvalidDevice = useMediaQuery({ query: '(max-width: 675px)' });

  useEffect(() => {
    if (user.isLoggedIn) {
      fetch(`${REACT_APP_API_URL}/stats?statsId=${user.statsId}&userId=${user.userId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
        .then(async (res) => {
          if (!res.ok) {
            const err = await res.json();
            if (err.message) {
              throw new Error(err.message);
            }
            throw new Error('ERROR');
          }
          return res.json();
        })
        .then((data) => {
          const stats = { ...data.stats };
          setUser({
            ...user,
            stats: {
              totalGames: stats.totalGames,
              highScore: stats.highScore,
              highTime: stats.highTime,
            },
          });
        });
      fetch(`${REACT_APP_API_URL}/game?userId=${user.userId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
        .then(async (res) => {
          if (!res.ok) {
            const err = await res.json();
            if (err.message) {
              throw new Error(err.message);
            }
            throw new Error('ERROR');
          }
          return res.json();
        })
        .then((data) => {
          setUser({
            ...user,
            games: [...data.games],
          });
        });
      window.localStorage.setItem(
        'USER',
        JSON.stringify({
          ...userRef.current,
        }),
      );
    } else {
      if (typeof user.stats.highScore === 'undefined') {
        window.localStorage.setItem(
          'USER',
          JSON.stringify({
            ...user,
            stats: {
              totalGames: 0,
              highScore: 0,
              highTime: 0,
            },
          }),
        );
      }
    }
  }, []);

  useEffect(() => {
    // Waits for the longest animation to finish before starting the game, this could be different depending on what is showing in the dom
    if (mainAnims) {
      setGameActive(false);
    } else {
      setTimeout(() => {
        setGameActive(true);
      }, '400');
    }
  }, [mainAnims]);

  const checkStartSettings = () => {
    // If the settings are changed and the user is starting a game, warning is dispatched
    if (settingsChanged.current) {
      dispatchWarning({
        type: 'startGameSettingsWarning',
        onClick1: () => warnStartGSonClick1(),
        onClick2: () => warnStartGSonClick2(),
        onClick3: () => warnStartGSonClick3(),
      });
      setCurrWarning('startGameSettingsWarning');
    } else {
      setMainAnims(false);
    }
  };

  // onClick for 'Cancel' button in 'startGameSettingsWarning' modal
  const warnStartGSonClick1 = useCallback(() => {
    // Removes the current warning state, which removes the modal from the screen
    setCurrWarning(null);
  });

  // onClick for 'No' button in 'startGameSettingsWarning' modal
  const warnStartGSonClick2 = useCallback(() => {
    // Resets the settings, then removes the modal and starts the game
    gameSettingsRef.current.resetSettings();
    setCurrWarning(null);
    setMainAnims(false);
  });

  // onClick for 'Yes' button in 'startGameSettingsWarning' modal
  const warnStartGSonClick3 = useCallback(() => {
    // Saves the settings, then removes the modal and starts the game or just removes the modal
    // The res() function can also be executed after a second modal is deployed.
    gameSettingsRef.current.saveSettings().then(
      () => {
        setCurrWarning(null);
        setMainAnims(false);
      },
      () => {
        setCurrWarning(null);
      },
    );
  });

  // Resetting all things necessary for ending the game
  const endGame = () => {
    setGameActive(false);
    setShowEndScreen(true);
    setShowSettings(false);
    setMainAnims(true);
  };

  // Showing the settings if the user clicks 'show settings' on the end screen
  const endSetActiveSettings = () => {
    setShowEndScreen(false);
    setShowSettings(true);
  };

  const buttonVariants = useMemo(() => {
    return {
      layout: true,
      initial: { opacity: 0, transition: { duration: 0.25, layout: { duration: 0.1 } } },
      animate: { opacity: 1, transition: { duration: 0.25, layout: { duration: 0.1 } } },
      exit: { opacity: 0, transition: { duration: 0.25, layout: { duration: 0.1 } } },
      transition: { layout: { duration: 0.2, ease: 'easeOut' } },
    };
  });

  const GameSettingsProps = {
    ref: gameSettingsRef,
    settingsChanged: settingsChanged,
    showSettings: { get: showSettings, set: (toSet) => setShowSettings(toSet) },
    currWarning: { get: currWarning, set: (toSet) => setCurrWarning(toSet) },
    dispatchWarning: dispatchWarning,
    setResetBtnDisabled: setResetBtnDisabled,
    setSaveBtnDisabled: setSaveBtnDisabled,
    mainAnims: mainAnims,
  };

  return (
    <div className='play'>
      <Navbar />
      {currWarning && (
        <Modal
          header={warning[`${currWarning}`].header}
          message={warning[`${currWarning}`].message}
          optOutOption={warning[`${currWarning}`].optOutOption}
          buttons={warning[`${currWarning}`].buttons}
        />
      )}
      {!isInvalidDevice ? (
        <>
          {!gameActive ? (
            <main className='main'>
              <AnimatePresence>
                {mainAnims && user.games.length > 0 && !showSettings && <Scores showEndScreen={showEndScreen} />}
              </AnimatePresence>
              <AnimatePresence mode='wait'>
                {!showEndScreen ? (
                  <GameSettings {...GameSettingsProps} />
                ) : (
                  <motion.div
                    key='endScreen'
                    className='end-screen'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className='end-stats-cont'>
                      <div className='end-stat-cont'>
                        <h2 className='end-stat-head'>Score:</h2>
                        <span className='end-stat'>{user.games[0].score}</span>
                      </div>
                      <div className='end-stat-cont'>
                        <h2 className='end-stat-head'>Time:</h2>
                        <span className='end-stat'>{user.games[0].time}</span>
                      </div>
                    </div>
                    <hr className='end-screen-break' />
                  </motion.div>
                )}
              </AnimatePresence>
              <div className='play-buttons'>
                <LayoutGroup>
                  <AnimatePresence mode='wait'>
                    {mainAnims && !showEndScreen && showSettings && (
                      <motion.div key='reset' {...buttonVariants}>
                        <Button
                          className='play-button'
                          text='Reset'
                          onClick={() => gameSettingsRef.current.resetSettings()}
                          disabled={resetBtnDisabled}
                        />
                      </motion.div>
                    )}
                    {mainAnims && !showEndScreen && showSettings && (
                      <motion.div key='save' {...buttonVariants}>
                        <Button
                          className='play-button'
                          text='Save'
                          onClick={() => gameSettingsRef.current.saveSettings()}
                          disabled={saveBtnDisabled}
                        />
                      </motion.div>
                    )}
                    {mainAnims && !showEndScreen && !showSettings && (
                      <motion.div key='settings' {...buttonVariants}>
                        <Button
                          className='play-button'
                          text='Settings'
                          onClick={() => setShowSettings(!showSettings)}
                        />
                      </motion.div>
                    )}
                    {mainAnims && showEndScreen && (
                      <motion.div key='endSettings' {...buttonVariants}>
                        <Button className='play-button' text='Settings' onClick={() => endSetActiveSettings()} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <AnimatePresence>
                    {mainAnims && (
                      <motion.div key='start' {...buttonVariants}>
                        <Button
                          className='play-button'
                          text={!showEndScreen ? 'Start' : 'Play Again'}
                          onClick={!showEndScreen ? () => checkStartSettings() : () => setMainAnims(false)}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </LayoutGroup>
              </div>
            </main>
          ) : (
            <PlayTilLose endGame={endGame} />
          )}
        </>
      ) : (
        <>
          <div className='invalid-container'>
            <h1 className='invalid-warning'>This game is intended for larger screens.</h1>
          </div>
          <Footer />
        </>
      )}
    </div>
  );
}

const warningReducer = (state, action) => {
  switch (action.type) {
    case 'startGameSettingsWarning': {
      return {
        ...state,
        startGameSettingsWarning: {
          header: 'Before Starting',
          message:
            "You haven't saved your new settings yet. Would you like to start the game with the updated settings?",
          optOutOption: null,
          buttons: [
            {
              text: 'Go Back',
              className: 'secondary',
              onClick: () => action.onClick1(),
            },
            {
              text: 'No',
              className: 'primary',
              onClick: () => action.onClick2(),
            },
            {
              text: 'Yes',
              className: 'primary',
              onClick: () => action.onClick3(),
            },
          ],
        },
      };
    }
    case 'saveGameSettingsWarning': {
      return {
        ...state,
        saveGameSettingsWarning: {
          header: 'Warning',
          message: 'Saving these settings will reset your previous scores and stats, since the difficulty will change.',
          optOutOption: 'saveGameSettingsWarning',
          buttons: [
            {
              text: 'Cancel',
              className: 'secondary',
              onClick: () => action.onClick1(),
            },
            {
              text: 'Ok',
              className: 'primary',
              onClick: () => action.onClick2(),
            },
          ],
        },
      };
    }
    case 'closeGameSettingsWarning': {
      return {
        ...state,
        closeGameSettingsWarning: {
          header: 'Warning',
          message: "You haven't saved your new settings yet. Would you like to save before closing?",
          optOutOption: 'closeGameSettingsWarning',
          buttons: [
            {
              text: 'No',
              className: 'secondary',
              onClick: () => action.onClick1(),
            },
            {
              text: 'Yes',
              className: 'primary',
              onClick: () => action.onClick2(),
            },
          ],
        },
      };
    }
    default: {
      throw Error('Unknown Warning');
    }
  }
};

export default Play;

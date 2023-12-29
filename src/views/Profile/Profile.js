import React, { useCallback, useContext, useEffect, useReducer, useState } from 'react';
import './Profile.css';
import { UserContext } from '../../hooks/UserContext';
import { Button } from '../../components/Button/Button';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { GameSlider } from '../../components/GamesSlider/GamesSlider';
import Modal from '../../components/Modal/Modal';

function Profile() {
  const { REACT_APP_API_URL } = process.env;
  const { user, setUser, userRef } = useContext(UserContext);
  const [warning, dispatchWarning] = useReducer(warningReducer, {});
  const [currWarning, setCurrWarning] = useState(null);

  useEffect(() => {
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
        window.localStorage.setItem(
          'USER',
          JSON.stringify({
            ...userRef.current,
          }),
        );
      });
  }, []);

  const warnDeleteUserClick1 = useCallback(() => {
    setCurrWarning(null);
  });

  const warnDeleteUserClick2 = useCallback(() => {
    deleteUser(false);
    setCurrWarning(null);
  });

  function deleteUser(warning) {
    if (warning) {
      dispatchWarning({
        type: 'deleteUserWarning',
        onClick1: () => warnDeleteUserClick1(),
        onClick2: () => warnDeleteUserClick2(),
      });
      setCurrWarning('deleteUserWarning');
    } else {
      fetch(`${REACT_APP_API_URL}/users/${user.userId}`, {
        method: 'DELETE',
      })
        .then(async (res) => {
          if (!res.ok) {
            if (!res.ok) {
              const err = await res.json();
              if (err.message) {
                throw new Error(err.message);
              }
              throw new Error('ERROR');
            }
          } else {
            setUser({
              ...user,
              isLoggedIn: false,
              userId: null,
              settingsId: null,
              statsId: null,
              username: null,
              gameSettings: {
                shrinkTime: 2.0,
                difficulty: { easy: false, medium: true, hard: false }, // FIXME: This can be made a string (i.e. 'medium')
                circleColor: '#FFFFFF',
                circleSize: { range: 'md', px: 100 },
              },
              games: [],
              stats: {},
              optOuts: {
                saveGameSettingsWarning: false,
                closeGameSettingsWarning: false,
              },
            });
            window.localStorage.removeItem('USER');
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  return (
    <div className='profile'>
      <Navbar />
      {currWarning && (
        <Modal
          header={warning[`${currWarning}`].header}
          message={warning[`${currWarning}`].message}
          optOutOption={warning[`${currWarning}`].optOutOption}
          buttons={warning[`${currWarning}`].buttons}
        />
      )}
      <main className='main'>
        <header className='header'>
          <h1>{user.username}</h1>
          <ul className='stats-list'>
            <li className='stat-container'>
              <span className='stat'>{user.stats.totalGames}</span>
            </li>
            <li className='stat-container'>
              <span className='stat'>{user.stats.highScore}</span>
            </li>
            <li className='stat-container'>
              <span className='stat'>{user.stats.highTime}</span>
            </li>
          </ul>
          <Button onClick={() => deleteUser(true)} text='delete' />
        </header>
        <section className='games'>
          {user.stats.totalGames !== 0 ? (
            <GameSlider totalGames={user.stats.totalGames} />
          ) : (
            <div className='play-now-wrapper'>
              <h2 className='play-now-header'>No games have been played</h2>
              <Button text='Play Now'></Button>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

const warningReducer = (state, action) => {
  switch (action.type) {
    case 'deleteUserWarning': {
      return {
        ...state,
        deleteUserWarning: {
          header: 'Are you sure?',
          message:
            'Deleting your account will permanently delete all your stats, games, and other data. Are you sure you would like to continue?',
          optOutOption: null,
          buttons: [
            {
              text: 'No',
              className: 'primary',
              onClick: () => action.onClick1(),
            },
            {
              text: 'Yes',
              className: 'secondary',
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

export default Profile;

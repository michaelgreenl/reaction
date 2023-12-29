import React, { useRef, useContext, useState, useEffect } from 'react';
import './GamesSlider.css';
import PropTypes from 'prop-types';
import { UserContext } from '../../hooks/UserContext';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { DownChevronSvg } from '../../svgs/DownChevronSvg';

export const GameSlider = (props) => {
  const { REACT_APP_API_URL } = process.env;
  const { user } = useContext(UserContext);

  const sliderRef = useRef(null);
  const [activeGames, setActiveGames] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [allGames, setAllGames] = useState([]);

  const _ = require('lodash');
  const settings = {
    className: 'game-slider',
    arrows: false,
    dots: true,
    infinite: false,
    speed: 0,
    slidesToShow: 1,
    slidesToScroll: 1,
    draggable: false,
  };

  const reformatTime = (time) => {
    return `${new Date(time)
      .toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      })
      .replace(/\s?[APM]{2}\s?/gi, (match) => match.trim().toLowerCase())} ${new Date(time).toLocaleDateString(
      'en-US',
      {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      },
    )}`;
  };

  async function getGames(offset) {
    if (allGames.length <= offset && allGames.length < props.totalGames) {
      await fetch(`${REACT_APP_API_URL}/game?userId=${user.userId}&limit=10&offset=${offset}`, {
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
          const games = data.games.map((game) => {
            return {
              score: game.score,
              time: game.time,
              createdAt: reformatTime(game.createdAt),
            };
          });
          setActiveGames([...games]);
          setAllGames([...allGames, ...games]);
        });
    } else {
      setActiveGames([...allGames.slice(offset, offset + 10)]);
    }
  }

  useEffect(() => {
    getGames(0);
  }, []);

  function handlePrevClick() {
    setActiveSlide(activeSlide - 1);
    getGames((activeSlide - 1) * 10);
    sliderRef.current.slickPrev();
  }

  function handleNextClick() {
    setActiveSlide(activeSlide + 1);
    getGames((activeSlide + 1) * 10);
    sliderRef.current.slickNext();
  }

  return (
    <div className='slider-wrapper'>
      <Slider ref={sliderRef} {...settings}>
        {_.range(0, props.totalGames / 10).map((index) => (
          <div key={index}>
            <table className='game-table'>
              <tbody>
                {activeGames.map((game, index) => (
                  <tr key={index} className='game-table-row'>
                    <td className='game-table-data'>{game.score}</td>
                    <td className='game-table-data'>{game.time}</td>
                    <td className='game-table-data'>{game.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className='previous-button' onClick={() => handlePrevClick()} disabled={activeSlide === 0}>
              prev
              <DownChevronSvg className='prev-button-svg' />
            </button>
            <button
              className='next-button'
              onClick={() => handleNextClick()}
              disabled={activeSlide === Math.ceil(props.totalGames / 10) - 1}
            >
              next
              <DownChevronSvg className='next-button-svg' />
            </button>
          </div>
        ))}
      </Slider>
    </div>
  );
};

GameSlider.propTypes = {
  totalGames: PropTypes.number,
};

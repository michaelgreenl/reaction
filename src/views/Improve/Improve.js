import React from 'react';
import { Footer } from '../../components/Footer/Footer';
import { Navbar } from '../../components/Navbar/Navbar';
import { DietSvg } from '../../svgs/DietSvg';
import { ExerciseSvg } from '../../svgs/ExerciseSvg';
import { MeditationSvg } from '../../svgs/MeditationSvg';
import { SleepSvg } from '../../svgs/SleepSvg';
import './Improve.css';

function Improve() {
  const svgStyles = {
    width: '5.5em',
    minWidth: '5.5em',
  };

  return (
    <div className='improve'>
      <Navbar />
      <header className='header'>
        <h1 className='header-text'>Improve Your Reaction</h1>
      </header>
      <main className='main'>
        <section className='links'>
          <div className='link-cont'>
            <h2 className='link-header'>Exercise</h2>
            <div className='description-cont'>
              <ExerciseSvg styling={svgStyles} />
              <p className='link-description'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam semper pharetra porta. Proin sed velit
                auctor massa egestas faucibus vel consequat lacus. , consectetur adipiscing elit. Etiam semper pharetra
                porta. Proin sed velit auctor massa egestas faucib
              </p>
            </div>
          </div>
          <div className='link-cont'>
            <h2 className='link-header'>Diet</h2>
            <div className='description-cont'>
              <DietSvg styling={svgStyles} />
              <p className='link-description'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam semper pharetra porta. Proin sed velit
                auctor massa egestas faucibus vel consequat lacus. , consectetur adipiscing elit. Etiam semper pharetra
                porta. Proin sed velit auctor massa egestas faucib
              </p>
            </div>
          </div>
          <div className='link-cont'>
            <h2 className='link-header'>Sleep</h2>
            <div className='description-cont'>
              <SleepSvg styling={svgStyles} />
              <p className='link-description'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam semper pharetra porta. Proin sed velit
                auctor massa egestas faucibus vel consequat lacus. , consectetur adipiscing elit. Etiam semper pharetra
                porta. Proin sed velit auctor massa egestas faucib
              </p>
            </div>
          </div>
          <div className='link-cont'>
            <h2 className='link-header'>Meditation</h2>
            <div className='description-cont'>
              <MeditationSvg styling={svgStyles} />
              <p className='link-description'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam semper pharetra porta. Proin sed velit
                auctor massa egestas faucibus vel consequat lacus. , consectetur adipiscing elit. Etiam semper pharetra
                porta. Proin sed velit auctor massa egestas faucib
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Improve;

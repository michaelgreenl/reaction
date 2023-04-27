import React from 'react';
import './Home.css';
import { Navbar } from '../../components/Navbar/Navbar';
import { Button } from '../../components/Button/Button';
import { LogoText } from '../../components/Logo/LogoText';
import { NavLink } from 'react-router-dom';

function Home() {
  return (
    <div className='home'>
      <Navbar />
      <main className='main'>
        <section className='logo'>
          <LogoText svgSize={{ width: '6em' }} textStyles={{ fontSize: '5em', margin: '0' }} />
          <NavLink to='/play'>
            <Button text='Play Now' styling={{ fontSize: '1.25em', marginLeft: '15%' }} />
          </NavLink>
          <video className='intro-video' loop muted autoPlay>
            <source src='/assets/videos/game.mp4' type='video/mp4' />
          </video>
        </section>
        <section className='intro'>
          <article className='intro-article'>
            <h2 className='intro-header'>Lorem ipsum dolor sit amet</h2>
            <p className='intro-content'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam semper pharetra porta. Proin sed velit
              auctor massa egestas faucibus vel consequat lacus.
            </p>
            <blockquote>Maecenas convallis sit amet ipsum a dapibus. Phasellus</blockquote>
            <p className='intro-content'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam semper pharetra porta. Proin sed velit
              auctor massa egestas faucibus vel consequat lacus. , consectetur adipiscing elit. Etiam semper pharetra
              porta. Proin sed velit auctor massa egestas faucib
            </p>
          </article>
        </section>
      </main>
      <footer className='footer'></footer>
    </div>
  );
}

export default Home;

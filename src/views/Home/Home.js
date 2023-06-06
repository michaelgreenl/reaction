import React from 'react';
import './Home.css';
import { Navbar } from '../../components/Navbar/Navbar';
import { Button } from '../../components/Button/Button';
import { LogoText } from '../../components/Logo/LogoText';
import { NavLink } from 'react-router-dom';
import { Footer } from '../../components/Footer/Footer';
import { useMediaQuery } from 'react-responsive';

function Home() {
  const isSmLaptop = useMediaQuery({ query: '(min-width: 1024px)' });
  const isSmPhone = useMediaQuery({ query: '(max-width: 450px)' });

  return (
    <div className='home'>
      <Navbar />
      <main className='main'>
        {isSmLaptop && (
          <header className='header'>
            <LogoText svgClassName='home-logo-svg' textClassName='home-logo-text' />
          </header>
        )}
        <section className='intro'>
          <h2 className='intro-header'>Why Reaction?</h2>
          <p className='intro-content'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam semper pharetra porta. Proin sed velit auctor
            massa egestas faucibus vel consequat lacus. Consectetur adipiscing elit. Etiam semper pharetra porta. Proin
            sed velit auctor massa egestas faucib
          </p>
          <blockquote className='intro-quote'>
            &quot;If you ain&apos;t first, you&apos;re last&quot;&nbsp;
            {isSmPhone && (
              <>
                <br />
                &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
              </>
            )}
            - Ricky Bobby
          </blockquote>
          <NavLink className='play-now-btn' to='/play'>
            <Button className='home-button' text='Play Now' />
          </NavLink>
        </section>
        <section className='video'>
          <video className='intro-video' loop muted autoPlay>
            <source src='/assets/videos/game.mp4' type='video/mp4' />
          </video>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Home;

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
          <LogoText svgSize={{ width: '6em' }} textSize={{ fontSize: '5em' }} />
          <NavLink to='/play'>
            <Button text='Play Game' styling={{ fontSize: '1.25em', marginLeft: '15%' }} />
          </NavLink>
        </section>
        <section className='intro'>
          <article className='intro-article'>
            <h2 className='intro-header'>Lorem ipsum dolor sit amet</h2>
            <p className='intro-content'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam semper pharetra porta. Proin sed velit
              auctor massa egestas faucibus vel consequat lacus.
            </p>
            <blockquote>Maecenas convallis sit amet ipsum a dapibus. Phasellus</blockquote>
            <p>
              eleifend facilisis turpis, a aliquam ligula hendrerit a. Nunc tempus eleifend nunc id gravida. Vestibulum
              quis ultrices felis. Aliquam erat volutpat. Vestibulum fringilla purus euismod massa scelerisque rutrum.
              Aliquam rutrum lacinia odio, ac gravida libero. Nam ut pulvinar urna. Maecenas eget congue odio. Ut
              bibendum feugiat feugiat. Donec congue id sapien vel molestie. Praesent bibendum risus non eros posuere,
              id scelerisque
            </p>
          </article>
          <div className='video'></div>
        </section>
      </main>
      <footer className='footer'></footer>
    </div>
  );
}

export default Home;

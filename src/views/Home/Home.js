import React from 'react';
import './Home.css';
import { Navbar } from '../../components/Navbar/Navbar';
import { Button } from '../../components/Button/Button';

function Home() {
  return (
    <div className='home'>
      <Navbar />
      <main className='main'>
        <header className='header'>
          <h1 className='header-text'>Reaction</h1>
          <Button text='Play' />
        </header>
        <section className='intro'>
          <article className='intro-article'>
            <h2 className='intro-header'>Lorem ipsum dolor sit amet</h2>
            <p className='intro-content'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam semper pharetra porta. Proin sed velit
              auctor massa egestas faucibus vel consequat lacus. Maecenas convallis sit amet ipsum a dapibus. Phasellus
              eleifend facilisis turpis, a aliquam ligula hendrerit a. Nunc tempus eleifend nunc id gravida. Vestibulum
              quis ultrices felis. Aliquam erat volutpat. Vestibulum fringilla purus euismod massa scelerisque rutrum.
              Aliquam rutrum lacinia odio, ac gravida libero. Nam ut pulvinar urna. Maecenas eget congue odio. Ut
              bibendum feugiat feugiat. Donec congue id sapien vel molestie. Praesent bibendum risus non eros posuere,
              id scelerisque
            </p>
          </article>
        </section>
      </main>
    </div>
  );
}

export default Home;

import React from 'react';
import { Button } from '../../components/Button/Button';
import { Navbar } from '../../components/Navbar/Navbar';
import { GithubSvg } from '../../svgs/GithubSvg';
import './Contact.css';

function Contact() {
  return (
    <div className='contact'>
      <Navbar />
      <header className='header'>
        <h1 className='header-text'>Contact</h1>
      </header>
      <main className='main'>
        <div className='other-links'>
          <h2 className='second-header'>Other Links</h2>
          <button className='other-link'>
            <GithubSvg styling={{ width: '3em' }} />
          </button>
        </div>
        <form className='contact-form' name='contact'>
          <ul className='form-inputs'>
            <li className='input-cont'>
              <label className='input-label' htmlFor='name'>
                Name
              </label>
              <input className='input-field' type='text' name='name' />
            </li>
            <li className='input-cont'>
              <label className='input-label' htmlFor='email'>
                Email
              </label>
              <input className='input-field' type='email' name='email' />
            </li>
            <li className='input-cont'>
              <label className='input-label' htmlFor='subject'>
                Subject
              </label>
              <input className='input-field' type='text' name='subject' />
            </li>
            <li className='input-cont'>
              <label className='input-label' htmlFor='message'>
                Message
              </label>
              <textarea className='input-field input-text-area' name='message'></textarea>
            </li>
          </ul>
          <Button text='Send' styling={{ fontSize: '1.1em', alignSelf: 'flex-end', marginRight: '-5%' }} />
        </form>
      </main>
      <footer className='footer'></footer>
    </div>
  );
}

export default Contact;

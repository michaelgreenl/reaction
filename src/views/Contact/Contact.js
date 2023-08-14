import React from 'react';
import { Button } from '../../components/Button/Button';
import Footer from '../../components/Footer/Footer';
import Navbar from '../../components/Navbar/Navbar';
import { GithubSvg } from '../../svgs/GithubSvg';
import './Contact.css';

function Contact() {
  return (
    <div className='contact'>
      <Navbar />
      <main className='main'>
        <header className='header'>
          <h1 className='header-text'>Contact</h1>
          <div className='other-links'>
            <button className='other-link'>
              <GithubSvg className='github-link' />
            </button>
          </div>
        </header>
        <section className='form-cont'>
          <form className='contact-form' name='contact'>
            <ul className='form-inputs'>
              <div className='small-input-cont'>
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
              </div>
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
            <Button text='Send' className='submit-button' />
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Contact;

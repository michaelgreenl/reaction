import React, { useRef, useState } from 'react';
import { Button } from '../../components/Button/Button';
import Footer from '../../components/Footer/Footer';
import Navbar from '../../components/Navbar/Navbar';
import { GithubSvg } from '../../svgs/GithubSvg';
import './Contact.css';
import { LogoSvg } from '../../svgs/LogoSvg';
import emailjs from '@emailjs/browser';
import { useMediaQuery } from 'react-responsive';

function Contact() {
  const { REACT_APP_SERVICE_ID, REACT_APP_TEMPLATE_ID, REACT_APP_PUBLIC_KEY } = process.env;
  const form = useRef();
  const [messageSent, setMessageSent] = useState(false);
  const isTablet = useMediaQuery({ query: '(max-width: 768px)' });

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm(REACT_APP_SERVICE_ID, REACT_APP_TEMPLATE_ID, form.current, REACT_APP_PUBLIC_KEY).then(
      (res) => {
        if (res.text === 'OK') {
          setMessageSent(true);
        }
      },
      (error) => {
        console.error(error.text);
      },
    );
  };

  return (
    <div className='contact'>
      <Navbar />
      <main className='main'>
        <ul className='other-links'>
          <li className='link-item'>
            <a className='other-link' href='https://github.com/michaelgreenl/reaction' target='_blank' rel='noreferrer'>
              <button className='other-link-button'>
                <GithubSvg className='github-link' />
              </button>
            </a>
          </li>
        </ul>
        {messageSent && isTablet && <span className='success-message'>Your message has been sent!</span>}
        <section className='form-cont'>
          <div className='form-header'>
            <LogoSvg className='header-logo' />
            <h2 className='header-text'>Contact</h2>
          </div>
          <form ref={form} className='contact-form' name='contact' onSubmit={(e) => sendEmail(e)}>
            <ul className='form-inputs'>
              <div className='small-input-cont'>
                <li className='input-cont'>
                  <label className='input-label' htmlFor='name'>
                    Name
                  </label>
                  <input className='input-field' type='text' name='name' required />
                </li>
                <li className='input-cont'>
                  <label className='input-label' htmlFor='email'>
                    Email
                  </label>
                  <input className='input-field' type='email' name='email' required />
                </li>
              </div>
              <li className='input-cont'>
                <label className='input-label' htmlFor='subject'>
                  Subject
                </label>
                <input className='input-field' type='text' name='subject' required />
              </li>
              <li className='input-cont'>
                <label className='input-label' htmlFor='message'>
                  Message
                </label>
                <textarea className='input-field input-text-area' name='message' required></textarea>
              </li>
            </ul>
            <div className='form-footer'>
              {messageSent && !isTablet && <span className='success-message'>Your message has been sent!</span>}
              <Button text='Send' className='submit-button' type='submit' />
            </div>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Contact;

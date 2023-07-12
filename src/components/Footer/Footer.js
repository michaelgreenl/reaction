import React, { PureComponent } from 'react';
import './Footer.css';

class Footer extends PureComponent {
  render() {
    return (
      <footer className='footer'>
        <span className='footer-text'>&copy; 2023 Reaction</span>
      </footer>
    );
  }
}

export default Footer;

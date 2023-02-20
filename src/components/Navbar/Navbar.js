import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className='navbar'>
      <span className='logo-text'>Reaction</span>
      <ul className='nav-list'>
        <li className='nav-item'>
          <NavLink className='nav-link' to='/'>
            Home
          </NavLink>
        </li>
        <li className='nav-item'>
          <NavLink className='nav-link' to='/play'>
            Play
          </NavLink>
        </li>
        <li className='nav-item'>
          <NavLink className='nav-link' to='/improve'>
            Improve
          </NavLink>
        </li>
        <li className='nav-item'>
          <NavLink className='nav-link' to='/contact'>
            Contact
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;

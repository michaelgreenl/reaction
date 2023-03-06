import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const url = window.location.href;
  const [notActiveHovered, setNotActiveHovered] = useState(() => false);

  return (
    <nav className='navbar'>
      <span className='logo-text' style={url.endsWith('/') ? { visibility: 'hidden' } : undefined}>
        Reaction
      </span>
      <ul className='nav-list'>
        <li className='nav-item'>
          <NavLink className='nav-link' to='/'>
            {({ isActive }) => (
              <span
                className={isActive && !notActiveHovered ? 'nav-link-active' : 'not-active'}
                onMouseOver={() => {
                  !isActive ? setNotActiveHovered(true) : setNotActiveHovered(false);
                }}
                onMouseOut={() => {
                  !isActive ? setNotActiveHovered(false) : undefined;
                }}
              >
                Home
              </span>
            )}
          </NavLink>
        </li>
        <li className='nav-item'>
          <NavLink className='nav-link' to='/play'>
            {({ isActive }) => (
              <span
                className={isActive && !notActiveHovered ? 'nav-link-active' : 'not-active'}
                onMouseOver={() => {
                  !isActive ? setNotActiveHovered(true) : setNotActiveHovered(false);
                }}
                onMouseOut={() => {
                  !isActive ? setNotActiveHovered(false) : undefined;
                }}
              >
                Play
              </span>
            )}
          </NavLink>
        </li>
        <li className='nav-item'>
          <NavLink className='nav-link' to='/improve'>
            {({ isActive }) => (
              <span
                className={isActive && !notActiveHovered ? 'nav-link-active' : 'not-active'}
                onMouseOver={() => {
                  !isActive ? setNotActiveHovered(true) : setNotActiveHovered(false);
                }}
                onMouseOut={() => {
                  !isActive ? setNotActiveHovered(false) : undefined;
                }}
              >
                Improve
              </span>
            )}
          </NavLink>
        </li>
        <li className='nav-item'>
          <NavLink className='nav-link' to='/contact'>
            {({ isActive }) => (
              <span
                className={isActive && !notActiveHovered ? 'nav-link-active' : 'not-active'}
                onMouseOver={() => {
                  !isActive ? setNotActiveHovered(true) : setNotActiveHovered(false);
                }}
                onMouseOut={() => {
                  !isActive ? setNotActiveHovered(false) : undefined;
                }}
              >
                Contact
              </span>
            )}
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;

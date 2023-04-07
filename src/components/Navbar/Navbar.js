import React, { useState } from 'react';
import './Navbar.css';
import { NavLink } from 'react-router-dom';
import { LogoText } from '../Logo/LogoText';

export const Navbar = () => {
  const url = window.location.href;
  const [notActiveHovered, setNotActiveHovered] = useState(false);

  return (
    <nav className='navbar'>
      <div className='logo-cont' style={url.endsWith('/') ? { visibility: 'hidden' } : undefined}>
        <LogoText svgSize={{ width: '1.4em' }} textSize={{ fontSize: '1.2em' }} />
      </div>
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
};

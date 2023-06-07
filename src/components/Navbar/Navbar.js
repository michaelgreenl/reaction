import React, { useState } from 'react';
import './Navbar.css';
import { NavLink } from 'react-router-dom';
import { LogoText } from '../Logo/LogoText';
import { useMediaQuery } from 'react-responsive';
import { MenuSvg } from '../../svgs/MenuSvg';

export const Navbar = () => {
  const url = window.location.href;
  const [notActiveHovered, setNotActiveHovered] = useState(false);
  const isSmLaptop = useMediaQuery({ query: '(min-width: 1024px)' });
  const isTablet = useMediaQuery({ query: '(max-width: 768px)' });

  return (
    <nav className='navbar'>
      <div className='logo-cont' style={url.endsWith('/') && isSmLaptop ? { display: 'none' } : undefined}>
        <LogoText svgClassName='navbar-logo-svg' textClassName='navbar-logo-text' />
      </div>
      {isTablet ? (
        <MenuSvg className='navbar-menu-icon' />
      ) : (
        <ul className={`nav-list ${url.endsWith('/') && isSmLaptop ? 'nav-list-home' : 'nav-list-logo'}`}>
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
      )}
    </nav>
  );
};

import React, { useState, useRef, useCallback, memo } from 'react';
import './Navbar.css';
import { LogoText } from '../Logo/LogoText';
import { useMediaQuery } from 'react-responsive';
import { MenuSvg } from '../../svgs/MenuSvg';
import NavItem from './NavItem';

const Navbar = () => {
  const url = useRef(window.location.href);
  const isSmLaptop = useMediaQuery({ query: '(min-width: 1024px)' });
  const isTablet = useMediaQuery({ query: '(max-width: 768px)' });
  const [notActiveHovered, setNotActiveHovered] = useState(false);

  /*
    When a NavItem other than the active one gets MouseOver/MouseOut this gets triggered. Making the animation for the
    NavItem that's currently hovered fire/turn off and the active NavItem turn off/fire.
  */
  const setActiveHover = useCallback((toSet) => {
    setNotActiveHovered(toSet);
  }, []);

  return (
    <nav className='navbar'>
      <div className='logo-cont' style={url.current.endsWith('/') && isSmLaptop ? { display: 'none' } : undefined}>
        <LogoText svgClassName='navbar-logo-svg' textClassName='navbar-logo-text' />
      </div>
      {/* Showing dropdown menu based on media-query */}
      {isTablet ? (
        <MenuSvg className='navbar-menu-icon' />
      ) : (
        <ul
          className={`nav-list ${url.current.endsWith('/') && isSmLaptop ? 'nav-list-home' : 'nav-list-logo'} ${
            notActiveHovered ? 'not-active-hovered' : undefined
          }`}
        >
          <NavItem link='/' text='Home' setNotActiveHovered={setActiveHover} />
          <NavItem link='/Play' text='Play' setNotActiveHovered={setActiveHover} />
          <NavItem link='/Contact' text='Contact' setNotActiveHovered={setActiveHover} />
        </ul>
      )}
    </nav>
  );
};

export default memo(Navbar);

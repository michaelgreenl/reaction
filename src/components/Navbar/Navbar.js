import React, { useState, useRef, useCallback, memo, useContext, useEffect } from 'react';
import './Navbar.css';
import PropTypes from 'prop-types';
import { UserContext } from '../../hooks/UserContext';
import { LogoText } from '../Logo/LogoText';
import { useMediaQuery } from 'react-responsive';
import { MenuSvg } from '../../svgs/MenuSvg';
import NavItem from './NavItem';
import { PolygonSvg } from '../../svgs/PolygonSvg';
import { ProfileSvg } from '../../svgs/ProfileSvg';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '../Button/Button';
import { AnimatePresence, motion } from 'framer-motion';

const Navbar = (props) => {
  const navbarRef = useRef();
  const url = useRef(window.location.href);
  const { user, setUser } = useContext(UserContext);
  const isSmLaptop = useMediaQuery({ query: '(min-width: 1024px)' });
  const isTablet = useMediaQuery({ query: '(max-width: 768px)' });
  const [notActiveHovered, setNotActiveHovered] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  /*
    When a NavItem other than the active one gets MouseOver/MouseOut this gets triggered. Making the animation for the
    NavItem that's currently hovered fire/turn off and the active NavItem turn off/fire.
  */
  const setActiveHover = useCallback((toSet) => {
    setNotActiveHovered(toSet);
  }, []);

  function handleLogout() {
    setUser({
      ...user,
      isLoggedIn: false,
      userId: null,
      settingsId: null,
      statsId: null,
      username: null,
      gameSettings: {
        shrinkTime: 2.0,
        difficulty: { easy: false, medium: true, hard: false }, // FIXME: This can be made a string
        circleColor: '#FFFFFF',
        circleSize: { range: 'md', px: 100 },
      },
      games: [],
      stats: {},
      optOuts: {
        saveGameSettingsWarning: false,
        closeGameSettingsWarning: false,
      },
    });
    window.localStorage.removeItem('USER');
    navigate('/auth');
  }

  return (
    <nav ref={navbarRef} className={`navbar ${url.current.endsWith('/') ? 'navbar-home' : undefined}`}>
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
          {!user.isLoggedIn ? (
            <NavItem link='/Auth' text='Login' setNotActiveHovered={setActiveHover} />
          ) : (
            <>
              <button className='dropdown-button' onClick={() => setShowProfileMenu(!showProfileMenu)}>
                <PolygonSvg className='dropdown-arrow' />
                <ProfileSvg className='nav-profile' />
              </button>
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    className='nav-dropdown'
                    key='profile-dropdown'
                    initial={{ height: 0, padding: 0 }}
                    animate={{ height: 'auto', padding: '0.4em 0' }}
                    exit={{ height: 0, padding: '0' }}
                    transition={{ duration: 0.1, ease: 'easeInOut' }}
                  >
                    <NavLink className='dropdown-nav-link' to='/Profile'>
                      <Button className='dropdown-nav-item' text='Profile' />
                    </NavLink>
                    <Button className='dropdown-nav-item' onClick={() => handleLogout()} text='Logout' />
                    {user.isLoggedIn && url.current.endsWith('/Profile') && (
                      <Button
                        className='dropdown-nav-item'
                        onClick={() => {
                          setShowProfileMenu(false);
                          props.deleteUser(true);
                        }}
                        text='Delete Account'
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </ul>
      )}
    </nav>
  );
};

Navbar.propTypes = {
  deleteUser: PropTypes.func,
};

export default memo(Navbar);

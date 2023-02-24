import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  // TODO: Make "Reaction" logo not show up on home page
  // TODO: Make active NavLink class off if another NavLink is being hovered over
  // TODO: Add actual :hover animation for activeclass
  // TODO: Add different :focus animation

  return (
    <nav className='navbar'>
      <span className='logo-text'>Reaction</span>
      <ul className='nav-list'>
        <li className='nav-item'>
          <NavLink className='nav-link' to='/'>
            {({ isActive }) => <span className={isActive ? 'nav-link-active' : 'not-active'}>Home</span>}
          </NavLink>
        </li>
        <li className='nav-item'>
          <NavLink className='nav-link' to='/play'>
            {({ isActive }) => <span className={isActive ? 'nav-link-active' : 'not-active'}>Play</span>}
          </NavLink>
        </li>
        <li className='nav-item'>
          <NavLink className='nav-link' to='/improve'>
            {({ isActive }) => <span className={isActive ? 'nav-link-active' : 'not-active'}>Improve</span>}
          </NavLink>
        </li>
        <li className='nav-item'>
          <NavLink className='nav-link' to='/contact'>
            {({ isActive }) => <span className={isActive ? 'nav-link-active' : 'not-active'}>Contact</span>}
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;

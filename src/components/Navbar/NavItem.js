import React, { memo } from 'react';
import { NavLink } from 'react-router-dom';
import { PropTypes } from 'prop-types';

const NavItem = ({ link, text, setNotActiveHovered }) => {
  return (
    <li className='nav-item'>
      <NavLink className='nav-link' to={link}>
        {({ isActive }) => (
          <span
            className={isActive ? 'nav-link-active' : 'not-active'}
            onMouseOver={() => {
              !isActive ? setNotActiveHovered(true) : setNotActiveHovered(false);
            }}
            onMouseOut={() => {
              !isActive ? setNotActiveHovered(false) : undefined;
            }}
          >
            {text}
          </span>
        )}
      </NavLink>
    </li>
  );
};

NavItem.propTypes = {
  link: PropTypes.string,
  text: PropTypes.string,
  setNotActiveHovered: PropTypes.func,
};

export default memo(NavItem);

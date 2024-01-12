import React, { memo } from 'react';
import { NavLink } from 'react-router-dom';
import { PropTypes } from 'prop-types';

const NavItem = ({ link, text, setNotActiveHovered, style }) => {
  return (
    <li className='nav-item' style={{ ...style }}>
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
  style: PropTypes.object,
};

export default memo(NavItem);

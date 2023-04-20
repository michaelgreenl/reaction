import React, { useContext } from 'react';
import './Circle.css';
import { UserContext } from '../../hooks/UserContext';
import { PropTypes } from 'prop-types';

export const Circle = (props) => {
  const { user } = useContext(UserContext);

  const circleStyle = {
    ...props.styles,
    width: `${user.gameSettings.circleSize}px`,
    backgroundColor: user.gameSettings.circleColor,
  };

  return (
    <div className='circle' style={circleStyle}>
      {user.gameSettings.showTime && <span className='time'>{user.gameSettings.shrinkTime}</span>}
    </div>
  );
};

Circle.propTypes = {
  styles: PropTypes.object,
};

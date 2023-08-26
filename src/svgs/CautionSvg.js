import React from 'react';
import PropTypes from 'prop-types';

export const CautionSvg = (props) => {
  return (
    <svg className={props.className} viewBox='0 0 53 48' xmlns='http://www.w3.org/2000/svg'>
      <path d='M22.6105 2.55078L0.777342 40.3643C0.382958 41.0471 0.17529 41.8218 0.175217 42.6103C0.175144 43.3989 0.382668 44.1736 0.776927 44.8565C1.17118 45.5394 1.73828 46.1065 2.42121 46.5008C3.10413 46.8951 3.87882 47.1026 4.66738 47.1025H48.3303C49.1188 47.1026 49.8935 46.8951 50.5764 46.5008C51.2594 46.1065 51.8265 45.5394 52.2207 44.8565C52.615 44.1736 52.8225 43.3989 52.8224 42.6103C52.8224 41.8218 52.6147 41.0471 52.2203 40.3643L30.3895 2.55078C29.9953 1.86805 29.4283 1.30111 28.7456 0.906943C28.0628 0.512773 27.2884 0.30526 26.5 0.30526C25.7116 0.30526 24.9372 0.512773 24.2544 0.906943C23.5717 1.30111 23.0047 1.86805 22.6105 2.55078Z' />
      <path
        d='M26.7848 14.2133H26.2152C24.8131 14.2133 23.6764 15.35 23.6764 16.7521V28.8875C23.6764 30.2897 24.8131 31.4264 26.2152 31.4264H26.7848C28.1869 31.4264 29.3236 30.2897 29.3236 28.8875V16.7521C29.3236 15.35 28.1869 14.2133 26.7848 14.2133Z'
        fill='#fff'
      />
      <path
        d='M26.5 41.051C28.0594 41.051 29.3236 39.7868 29.3236 38.2273C29.3236 36.6679 28.0594 35.4037 26.5 35.4037C24.9405 35.4037 23.6764 36.6679 23.6764 38.2273C23.6764 39.7868 24.9405 41.051 26.5 41.051Z'
        fill='#fff'
      />
    </svg>
  );
};

CautionSvg.propTypes = {
  className: PropTypes.string,
};

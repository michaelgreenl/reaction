import React from 'react';
import PropTypes from 'prop-types';

export const GithubSvg = (props) => {
  return (
    <svg viewBox='0 0 32 32' style={{ ...props.styling }} fill='#fff' xmlns='http://www.w3.org/2000/svg'>
      <path d='M15.9999 -1.52588e-05C7.16521 -1.52588e-05 -0.00012207 7.34509 -0.00012207 16.4045C-0.00012207 23.6525 4.58388 29.8015 10.9425 31.971C11.7412 32.1227 11.9999 31.6142 11.9999 31.1822V28.1282C7.54921 29.1207 6.62254 26.1925 6.62254 26.1925C5.89454 24.2964 4.84521 23.792 4.84521 23.792C3.39321 22.7735 4.95588 22.7954 4.95588 22.7954C6.56254 22.9102 7.40788 24.4864 7.40788 24.4864C8.83454 26.9936 11.1505 26.269 12.0639 25.8494C12.2065 24.7899 12.6212 24.0654 13.0799 23.6566C9.52654 23.2397 5.79054 21.833 5.79054 15.5487C5.79054 13.7565 6.41588 12.2938 7.43854 11.1455C7.27321 10.7313 6.72521 9.0621 7.59454 6.80375C7.59454 6.80375 8.93854 6.36356 11.9959 8.4852C13.2719 8.12157 14.6399 7.93976 15.9999 7.93292C17.3599 7.93976 18.7292 8.12157 20.0079 8.4852C23.0625 6.36356 24.4039 6.80375 24.4039 6.80375C25.2745 9.06346 24.7265 10.7326 24.5612 11.1455C25.5879 12.2938 26.2079 13.7579 26.2079 15.5487C26.2079 21.8494 22.4652 23.2369 18.9025 23.6429C19.4759 24.1515 19.9999 25.1494 19.9999 26.6805V31.1822C19.9999 31.6183 20.2559 32.1309 21.0679 31.9696C27.4212 29.7974 31.9999 23.6498 31.9999 16.4045C31.9999 7.34509 24.8359 -1.52588e-05 15.9999 -1.52588e-05Z' />
    </svg>
  );
};

GithubSvg.propTypes = {
  styling: PropTypes.object,
};
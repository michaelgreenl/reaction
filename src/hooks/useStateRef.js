import { useState, useRef } from 'react';
import PropTypes from 'prop-types';

export const useStateRef = ({ val }) => {
  const [state, setState] = useState(val);
  const ref = useRef(val);

  function setter(toSet) {
    setState(toSet);
    ref.current = toSet;
  }

  return [state, setter, ref];
};

useStateRef.propTypes = {
  val: PropTypes.any,
};

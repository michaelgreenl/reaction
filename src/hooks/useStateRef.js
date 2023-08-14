import { useState, useRef } from 'react';
import PropTypes from 'prop-types';

/* 
  Uses useState and useRef simultaneously, so that if the state is updated in a function that state value can be 
  used within the same function through the ref. 
*/
export const useStateRef = ({ val }) => {
  const [state, setState] = useState(val);
  const ref = useRef(val);

  // Sets the state and the ref. The updated value can now be retrieved through the ref
  function setter(toSet) {
    setState(toSet);
    ref.current = toSet;
  }

  return [state, setter, ref];
};

useStateRef.propTypes = {
  val: PropTypes.any,
};

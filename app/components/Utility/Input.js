import React from 'react';
import PropTypes from 'prop-types';

const Input = props => {
  return (
    <input
      className={props.className}
      id={props.id}
      name={props.name}
      type={props.type}
      value={props.value}
      onChange={props.handleChange}
      placeholder={props.placeholder}
    />
  );
};

Input.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string.isRequired,
  value: PropTypes.string,
  handleChange: PropTypes.func,
  placeholder: PropTypes.string
};

export default Input;

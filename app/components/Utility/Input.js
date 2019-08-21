import React from 'react';

const Input = props => {
  return (
    <input
      className="form-input"
      id={props.name}
      name={props.name}
      type={props.type}
      value={props.value}
      onChange={props.handleChange}
      placeholder={props.placeholder}
    />
  );
};

export default Input;

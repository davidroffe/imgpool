import React from 'react';

const FileInput = props => {
  const handleClick = e => {
    e.preventDefault();
    e.target.nextSibling.click();
  };
  return (
    <div className="upload-container">
      <button onClick={handleClick}>CHOOSE FILE</button>
      <input
        style={{ display: 'none' }}
        className={props.className}
        id={props.id}
        name={props.name}
        type={props.type}
        value={props.value}
        onChange={props.handleChange}
        placeholder={props.placeholder}
      />
    </div>
  );
};

export default FileInput;

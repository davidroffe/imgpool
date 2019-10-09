import React, { useState } from 'react';
import PropTypes from 'prop-types';

const FileInput = props => {
  const [placeholder, setPlaceholder] = useState(
    props.placeholder || 'CHOOSE FILE'
  );
  const handleClick = e => {
    e.preventDefault();
    e.target.nextSibling.click();
  };
  const handleChange = e => {
    const fileName = e.target.value.replace(/^.*?([^\\/]*)$/, '$1');

    if (fileName) {
      setPlaceholder(fileName);
    } else {
      setPlaceholder(props.placeholder || 'CHOOSE FILE');
    }

    props.handleChange(e);
  };
  return (
    <div className="upload-container">
      <button type="button" onClick={handleClick}>
        {placeholder}
      </button>
      <input
        style={{ display: 'none' }}
        className={props.className}
        id={props.id}
        name={props.name}
        type="file"
        value={props.value}
        onChange={handleChange}
      />
    </div>
  );
};

FileInput.propTypes = {
  placeholder: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string
};

export default FileInput;

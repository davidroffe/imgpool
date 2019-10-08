import React from 'react';
import PropTypes from 'prop-types';

const Modal = props => {
  return props.show ? (
    <div className="loader-container">
      <div className="preloader2">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  ) : null;
};

Modal.propTypes = {
  show: PropTypes.bool.isRequired
};

export default Modal;

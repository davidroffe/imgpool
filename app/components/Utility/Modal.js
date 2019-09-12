import React from 'react';
import PropTypes from 'prop-types';

const Modal = props => {
  return (
    <div id="modal-container" onClick={props.toggleModal}>
      <div id="modal">{props.children}</div>
    </div>
  );
};

Modal.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  children: PropTypes.element.isRequire
};

export default Modal;

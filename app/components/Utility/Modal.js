import React from 'react';
import PropTypes from 'prop-types';

const Modal = props => {
  return (
    <div id="modal-container" onClick={props.toggleModal}>
      <div id="modal" onClick={e => e.stopPropagation()}>
        {props.children}
      </div>
    </div>
  );
};

Modal.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired
};

export default Modal;

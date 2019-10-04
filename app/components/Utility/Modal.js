import React from 'react';
import PropTypes from 'prop-types';

const Modal = props => {
  return props.show ? (
    <div id="modal-container" onClick={props.toggleModal}>
      <div id="modal" onClick={e => e.stopPropagation()}>
        {props.children}
      </div>
    </div>
  ) : null;
};

Modal.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired,
  show: PropTypes.bool.isRequired
};

export default Modal;

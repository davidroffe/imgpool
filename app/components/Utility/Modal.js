import React from 'react';

const Modal = props => {
  return (
    <div id="modal-container" onClick={props.toggleModal}>
      <div id="modal">{props.children}</div>
    </div>
  );
};

export default Modal;

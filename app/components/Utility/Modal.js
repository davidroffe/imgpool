import React from 'react';

const Modal = props => {
  return (
    <div id="modal-container" onClick={props.handleClick}>
      <div id="modal">{props.children}</div>
    </div>
  );
};

export default Modal;

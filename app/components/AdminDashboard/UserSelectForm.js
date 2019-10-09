import React, { useState } from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import Modal from '../Utility/Modal';

const UserSelectForm = props => {
  const [selectedUser, setSelectedUser] = useState({});

  const handleChange = selectedUser => {
    setSelectedUser(selectedUser);
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (selectedUser.hasOwnProperty('id'))
      props.history.push(`/user/${selectedUser.id}`);
  };

  return (
    <Modal show={props.show} toggleModal={() => props.toggleShow(!props.show)}>
      <form id="admin-manage-form" className="form-light">
        <Select
          classNamePrefix="admin-manage-select"
          options={props.users.map(user => {
            return {
              value: user.username,
              label: `${user.username} ${user.active ? '' : '(Disabled)'}`,
              id: user.id
            };
          })}
          onChange={handleChange}
        />
        <div className="error-messages">
          {props.errorMessage.map((errorMessage, index) => {
            return (
              <p key={index} className="error">
                {errorMessage}
              </p>
            );
          })}
        </div>
        <button
          id="manage-user"
          className="border-button"
          onClick={handleSubmit}
        >
          Manage
        </button>
      </form>
    </Modal>
  );
};

UserSelectForm.propTypes = {
  history: PropTypes.object.isRequired,
  users: PropTypes.array.isRequired,
  show: PropTypes.bool.isRequired,
  toggleShow: PropTypes.func.isRequired,
  errorMessage: PropTypes.array.isRequired
};

export default UserSelectForm;

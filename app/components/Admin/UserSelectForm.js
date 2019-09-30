import React, { useState } from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import Modal from '../Utility/Modal';

const UserSelectForm = props => {
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleChange = selectedUsers => {
    setSelectedUsers(selectedUsers);
  };

  const handleSubmit = e => {
    e.preventDefault();
    const userIds = selectedUsers.map(user => {
      return user.id;
    });
    const url =
      e.target.id === 'toggle-state' ? '/api/user/toggle' : 'api/user/delete';

    props.handleSubmit(url, userIds);
    setSelectedUsers([]);
  };

  return props.show ? (
    <Modal
      showModal={props.show}
      toggleModal={() => props.toggleShow(!props.show)}
    >
      <form id="admin-manage-form" className="form-light">
        <Select
          classNamePrefix="admin-manage-select"
          isMulti
          closeMenuOnSelect={false}
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
          id="toggle-state"
          className="border-button"
          onClick={handleSubmit}
        >
          Toggle State
        </button>
        <button
          id="delete"
          className="border-button-red"
          onClick={handleSubmit}
        >
          Delete
        </button>
      </form>
    </Modal>
  ) : null;
};

UserSelectForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
  show: PropTypes.bool.isRequired,
  toggleShow: PropTypes.func.isRequired,
  errorMessage: PropTypes.array.isRequired
};

export default UserSelectForm;

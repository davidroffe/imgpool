import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import Modal from '../Utility/Modal';

const UserSelectForm = props => {
  const handleChange = selectedUser => {
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
      </form>
    </Modal>
  );
};

UserSelectForm.propTypes = {
  history: PropTypes.object.isRequired,
  users: PropTypes.array.isRequired,
  show: PropTypes.bool.isRequired,
  toggleShow: PropTypes.func.isRequired
};

export default UserSelectForm;

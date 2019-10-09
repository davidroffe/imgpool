import React from 'react';
import PropTypes from 'prop-types';
import Input from '../Utility/Input';
import Modal from '../Utility/Modal';

const EditAccount = props => {
  return (
    <Modal show={props.data.show} toggleModal={props.clearValues}>
      <form id="edit-form" className="form-light" onSubmit={props.handleSubmit}>
        {props.data.field === 'edit-username' ? (
          <Input
            id="username"
            autoComplete={'off'}
            type={'text'}
            title={'Username'}
            name={'username'}
            value={props.data.username}
            placeholder={'USERNAME'}
            handleChange={props.handleChange.bind(
              null,
              'editAccount',
              'username'
            )}
          />
        ) : null}
        {props.data.field === 'edit-email' ? (
          <Input
            id="email"
            autoComplete={'off'}
            type={'text'}
            title={'Email'}
            name={'email'}
            value={props.data.email}
            placeholder={'EMAIL'}
            handleChange={props.handleChange.bind(null, 'editAccount', 'email')}
          />
        ) : null}
        {props.data.field === 'edit-bio' ? (
          <textarea
            id="bio"
            title={'Bio'}
            name={'bio'}
            value={props.data.bio}
            placeholder={'BIO'}
            onChange={props.handleChange.bind(null, 'editAccount', 'bio')}
          />
        ) : null}
        <div className="error-messages">
          {props.data.errorMessage.map((errorMessage, index) => {
            return (
              <p key={index} className="error">
                {errorMessage}
              </p>
            );
          })}
        </div>
        <Input className="border-button" type="submit" />
      </form>
    </Modal>
  );
};

EditAccount.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  clearValues: PropTypes.func.isRequired,
  data: PropTypes.shape({
    show: PropTypes.bool.isRequired,
    field: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    bio: PropTypes.string.isRequired,
    errorMessage: PropTypes.array.isRequired
  })
};

export default EditAccount;

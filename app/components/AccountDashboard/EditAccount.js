import React from 'react';
import PropTypes from 'prop-types';
import Input from '../Utility/Input';
import Modal from '../Utility/Modal';

const EditAccount = props => {
  return (
    <Modal show={props.data.show} toggleModal={props.clearValues}>
      <form id="edit-form" className="form-light" onSubmit={props.handleSubmit}>
        <div className="field-container">
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
              handleChange={props.handleChange.bind(
                null,
                'editAccount',
                'email'
              )}
            />
          ) : null}
          {props.data.field === 'edit-password' ? (
            <div>
              <Input
                id="password"
                autoComplete={'off'}
                type={'password'}
                title={'Password'}
                name={'password'}
                value={props.data.password}
                placeholder={'PASSWORD'}
                handleChange={props.handleChange.bind(
                  null,
                  'editAccount',
                  'password'
                )}
              />
              <Input
                id="passwordConfirm"
                autoComplete={'off'}
                type={'password'}
                title={'Password Confirm'}
                name={'password-confirm'}
                value={props.data.passwordConfirm}
                placeholder={'CONFIRM PASSWORD'}
                handleChange={props.handleChange.bind(
                  null,
                  'editAccount',
                  'passwordConfirm'
                )}
              />
            </div>
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
    password: PropTypes.string.isRequired,
    passwordConfirm: PropTypes.string.isRequired
  })
};

export default EditAccount;

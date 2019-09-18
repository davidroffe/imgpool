import React from 'react';
import PropTypes from 'prop-types';
import Input from '../Utility/Input';

const Edit = props => {
  return (
    <form id="edit-form" className="form-light" onSubmit={props.handleSubmit}>
      {props.field === 'edit-username' ? (
        <Input
          id="username"
          autoComplete={'off'}
          type={'text'}
          title={'Username'}
          name={'username'}
          value={props.username}
          placeholder={'USERNAME'}
          handleChange={e => props.setEditUsername(e.target.value)}
        />
      ) : null}
      {props.field === 'edit-email' ? (
        <Input
          id="email"
          autoComplete={'off'}
          type={'text'}
          title={'Full Name'}
          name={'email'}
          value={props.email}
          placeholder={'EMAIL'}
          handleChange={e => props.setEditEmail(e.target.value)}
        />
      ) : null}
      {props.field === 'edit-password' ? (
        <div>
          <Input
            id="password"
            autoComplete={'off'}
            type={'password'}
            title={'Password'}
            name={'password'}
            value={props.password}
            placeholder={'PASSWORD'}
            handleChange={e => props.setEditPassword(e.target.value)}
          />
          <Input
            id="passwordConfirm"
            autoComplete={'off'}
            type={'password'}
            title={'password-confirm'}
            name={'password-confirm'}
            value={props.passwordConfirm}
            placeholder={'CONFIRM PASSWORD'}
            handleChange={e => props.setEditPasswordConfirm(e.target.value)}
          />
        </div>
      ) : null}
      <div className="error-messages">
        {props.errorMessage.map((errorMessage, index) => {
          return (
            <p key={index} className="error">
              {errorMessage}
            </p>
          );
        })}
      </div>
      <Input className="border-button" type="submit" />
    </form>
  );
};

Edit.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  field: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  passwordConfirm: PropTypes.string.isRequired,
  setEditEmail: PropTypes.func.isRequired,
  setEditUsername: PropTypes.func.isRequired,
  setEditPassword: PropTypes.func.isRequired,
  setEditPasswordConfirm: PropTypes.func.isRequired,
  errorMessage: PropTypes.array.isRequired
};

export default Edit;

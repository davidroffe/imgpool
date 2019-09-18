import React from 'react';
import PropTypes from 'prop-types';
import Input from '../Utility/Input';

const Delete = props => {
  return (
    <form
      id="delete-account-form"
      className="form-light"
      onSubmit={props.handleSubmit}
    >
      <div>
        <Input
          id="password"
          autoComplete={'off'}
          type={'password'}
          title={'Password'}
          name={'password'}
          value={props.password}
          placeholder={'PASSWORD'}
          handleChange={e => props.setPassword(e.target.value)}
        />
        <Input
          id="passwordConfirm"
          autoComplete={'off'}
          type={'password'}
          title={'password-confirm'}
          name={'password-confirm'}
          value={props.passwordConfirm}
          placeholder={'CONFIRM PASSWORD'}
          handleChange={e => props.setPasswordConfirm(e.target.value)}
        />
      </div>
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

Delete.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  passwordConfirm: PropTypes.string.isRequired,
  setPassword: PropTypes.func.isRequired,
  setPasswordConfirm: PropTypes.func.isRequired,
  errorMessage: PropTypes.array.isRequired
};

export default Delete;

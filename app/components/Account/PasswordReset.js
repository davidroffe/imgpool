import React from 'react';
import PropTypes from 'prop-types';
import Input from '../Utility/Input';

const PasswordReset = props => {
  return (
    <div id="account-center">
      <div id="center-box">
        <form className="form-dark" onSubmit={props.handleSubmit}>
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
          <div className="error-messages">
            {props.errorMessage.map((errorMessage, index) => {
              return (
                <p key={index} className="error">
                  {errorMessage}
                </p>
              );
            })}
          </div>
          <Input
            className="border-button"
            type="submit"
            value="RESET PASSWORD"
          />
        </form>
      </div>
    </div>
  );
};

PasswordReset.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  setPassword: PropTypes.func.isRequired,
  setPasswordConfirm: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  passwordConfirm: PropTypes.string.isRequired,
  errorMessage: PropTypes.array.isRequired
};

export default PasswordReset;

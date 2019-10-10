import React, { useState } from 'react';
import { connect } from 'react-redux';
import { setUser } from '../actions';
import PropTypes from 'prop-types';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Input from './Utility/Input';

const PasswordReset = props => {
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const handlePasswordResetSubmit = e => {
    e.preventDefault();

    let newErrorMessage = [];
    const url = '/api/user/password-reset';

    if (password !== passwordConfirm) {
      newErrorMessage.push('Passwords do not match.');
    }
    if (password.length < 8) {
      newErrorMessage.push('Password must be at least 8 characters.');
    }
    if (newErrorMessage.length > 0) {
      newErrorMessage.forEach(error => {
        toast.error(error);
      });
    } else {
      axios({
        url: url,
        method: 'post',
        params: {
          passwordResetToken: props.match.params.passwordResetToken,
          password: password
        }
      })
        .then(res => {
          props.dispatch(setUser('email', res.data.email));
          props.dispatch(setUser('username', res.data.username));
          props.dispatch(setUser('loggedIn', true));
          props.history.push('/account');
        })
        .catch(error => {
          toast.error(error.response.data);
        });
    }
  };
  return (
    <div id="account-center">
      <ToastContainer />
      <div id="center-box">
        <form className="form-dark" onSubmit={handlePasswordResetSubmit}>
          <div className="field-container">
            <Input
              id="password"
              autoComplete={'off'}
              type={'password'}
              title={'Password'}
              name={'password'}
              value={password}
              placeholder={'PASSWORD'}
              handleChange={e => setPassword(e.target.value)}
            />
            <Input
              id="passwordConfirm"
              autoComplete={'off'}
              type={'password'}
              title={'password-confirm'}
              name={'password-confirm'}
              value={passwordConfirm}
              placeholder={'CONFIRM PASSWORD'}
              handleChange={e => setPasswordConfirm(e.target.value)}
            />
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
  dispatch: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default connect(() => {
  return {};
})(PasswordReset);

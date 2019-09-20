import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setUser } from '../../actions';
import axios from 'axios';
import Input from '../Utility/Input';

const mapStateToProps = state => {
  return {
    email: state.user.email,
    username: state.user.username,
    password: state.user.password,
    passwordConfirm: state.user.passwordConfirm
  };
};

const Login = props => {
  const [errorMessage, setErrorMessage] = useState([]);
  const [form, setForm] = useState('login');

  const handleSubmit = e => {
    e.preventDefault();

    let newErrorMessage = [];
    let url;

    const { email, username, password, passwordConfirm } = props;

    switch (form) {
      case 'login':
        url = '/api/user/login';
        break;
      case 'signUp':
        url = '/api/user/signup';
        break;
      case 'forgotPassword':
        url = '/api/user/password-reset';
        break;
    }

    if (email === undefined || email === '') {
      newErrorMessage.push('Please enter an email.');
    }
    if (form === 'login' || form === 'signUp') {
      if (password === undefined || password === '') {
        newErrorMessage.push('Please enter a password.');
      }
    }
    if (form === 'signUp') {
      if (password !== passwordConfirm) {
        newErrorMessage.push('Passwords do not match.');
      }
      if (password.length < 8) {
        newErrorMessage.push('Password must be at least 8 characters.');
      }
    }
    if (newErrorMessage.length > 0) {
      setErrorMessage(newErrorMessage);
    } else {
      axios({
        url: url,
        method: 'post',
        params: {
          email: email,
          username: username,
          password: password,
          passwordConfirm: passwordConfirm
        }
      })
        .then(res => {
          if (form === 'forgotPassword') {
            setErrorMessage(['An email has been sent.']);
          } else {
            props.dispatch(setUser('email', res.data.email));
            props.dispatch(setUser('username', res.data.username));
            props.dispatch(setUser('loggedIn', true));
            props.dispatch(setUser('admin', res.data.admin));
          }
        })
        .catch(error => {
          setErrorMessage([error.response.data]);
        });
    }
  };

  const handleChange = e => {
    const field = e.target.id;
    const value = e.target.value;

    props.dispatch(setUser(field, value));
  };

  const switchForm = e => {
    e.preventDefault();

    if (e.target.id === 'forgot-password') {
      setForm('forgotPassword');
    } else {
      setForm(form === 'login' ? 'signUp' : 'login');
    }
  };

  return (
    <div id="account-center">
      <div id="center-box">
        <form className="form-dark" onSubmit={handleSubmit}>
          <Input
            id="email"
            autoComplete={'off'}
            type={'text'}
            title={'Full Name'}
            name={'email'}
            value={props.email}
            placeholder={'EMAIL'}
            handleChange={handleChange}
          />
          {form === 'signUp' ? (
            <Input
              id="username"
              autoComplete={'off'}
              type={'text'}
              title={'Username'}
              name={'username'}
              value={props.username}
              placeholder={'USERNAME'}
              handleChange={handleChange}
            />
          ) : null}
          {form === 'signUp' || form === 'login' ? (
            <Input
              id="password"
              autoComplete={'off'}
              type={'password'}
              title={'Password'}
              name={'password'}
              value={props.password}
              placeholder={'PASSWORD'}
              handleChange={handleChange}
            />
          ) : null}
          {form === 'signUp' ? (
            <Input
              id="passwordConfirm"
              autoComplete={'off'}
              type={'password'}
              title={'password-confirm'}
              name={'password-confirm'}
              value={props.passwordConfirm}
              placeholder={'CONFIRM PASSWORD'}
              handleChange={handleChange}
            />
          ) : null}
          <div className="error-messages">
            {errorMessage.map((errorMessage, index) => {
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
            value={(() => {
              switch (form) {
                case 'login':
                  return 'LOGIN';
                case 'signUp':
                  return 'SIGN UP';
                case 'forgotPassword':
                  return 'SEND EMAIL';
              }
            })()}
          />
          <p>
            <button className="switch-form" onClick={switchForm}>
              {form === 'login' ? 'Sign Up' : 'Login'}
            </button>
            <span> | </span>
            <button
              id="forgot-password"
              className="switch-form"
              onClick={switchForm}
            >
              Forgot Password
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

Login.propTypes = {
  dispatch: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  passwordConfirm: PropTypes.string.isRequired
};

export default connect(mapStateToProps)(Login);

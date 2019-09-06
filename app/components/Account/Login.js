import React from 'react';
import Input from '../Utility/Input';

const Login = props => {
  return (
    <div id="account-center">
      <div id="center-box">
        <form className="form-dark" onSubmit={props.handleSubmit}>
          <Input
            id="email"
            autoComplete={'off'}
            type={'text'}
            title={'Full Name'}
            name={'email'}
            value={props.email}
            placeholder={'EMAIL'}
            handleChange={props.handleChange}
          />
          {props.form === 'signUp' ? (
            <Input
              id="username"
              autoComplete={'off'}
              type={'text'}
              title={'Username'}
              name={'username'}
              value={props.username}
              placeholder={'USERNAME'}
              handleChange={props.handleChange}
            />
          ) : null}
          <Input
            id="password"
            autoComplete={'off'}
            type={'password'}
            title={'Password'}
            name={'password'}
            value={props.password}
            placeholder={'PASSWORD'}
            handleChange={props.handleChange}
          />
          {props.form === 'signUp' ? (
            <Input
              id="passwordConfirm"
              autoComplete={'off'}
              type={'password'}
              title={'password-confirm'}
              name={'password-confirm'}
              value={props.passwordConfirm}
              placeholder={'CONFIRM PASSWORD'}
              handleChange={props.handleChange}
            />
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
          <Input
            className="border-button"
            type={'submit'}
            value={props.form === 'login' ? 'LOGIN' : 'SIGN UP'}
          />
          <p>
            Don‘t have an account?{' '}
            <button className="switch-form" onClick={props.handleSwitchForm}>
              {props.form === 'login' ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;

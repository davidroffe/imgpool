import React from 'react';
import Input from '../Utility/Input';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = props.handleChange;
    this.handleSubmit = props.handleSubmit;
    this.handleSwitchForm = props.handleSwitchForm;
  }
  render() {
    return (
      <div id="account-center">
        <div id="center-box">
          <form onSubmit={this.handleSubmit}>
            <Input
              id="email"
              autoComplete={'off'}
              type={'text'}
              title={'Full Name'}
              name={'email'}
              value={this.props.email}
              placeholder={'EMAIL'}
              handleChange={this.handleChange}
            />
            <Input
              id="password"
              autoComplete={'off'}
              type={'password'}
              title={'Password'}
              name={'password'}
              value={this.props.password}
              placeholder={'PASSWORD'}
              handleChange={this.handleChange}
            />
            {this.props.form === 'signUp' ? (
              <Input
                id="passwordConfirm"
                autoComplete={'off'}
                type={'password'}
                title={'Password'}
                name={'password'}
                value={this.props.passwordConfirm}
                placeholder={'CONFIRM PASSWORD'}
                handleChange={this.handleChange}
              />
            ) : null}
            {this.props.errorMessage.map((errorMessage, index) => {
              return (
                <p key={index} className="error">
                  {errorMessage}
                </p>
              );
            })}
            <Input
              type={'submit'}
              value={this.props.form === 'login' ? 'LOGIN' : 'SIGN UP'}
            />
            <p>
              Don‘t have an account?{' '}
              <button className="switch-form" onClick={this.handleSwitchForm}>
                {this.props.form === 'login' ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;

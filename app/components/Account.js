import React from 'react';
import axios from 'axios';

class Account extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      form: 'login',
      email: '',
      password: '',
      passwordConfirm: '',
      errorMessage: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSwitchForm = this.handleSwitchForm.bind(this);
  }
  componentDidMount() {}
  handleChange(event) {
    let value = event.target.value;
    let newState = {};

    newState[event.target.id] = value;
    this.setState(newState);
  }
  handleSubmit(e) {
    e.preventDefault();

    let form = this.state.form;
    let errorMessage = [];
    let email = this.state.email;
    let password = this.state.password;
    let passwordConfirm = this.state.passwordConfirm;
    let splashClass = this;
    const url = form === 'login' ? '/api/login' : '/api/signup';

    if (email === undefined || email === '') {
      errorMessage.push('Please enter an email.');
    }
    if (password === undefined || password === '') {
      errorMessage.push('Please enter a password.');
    }
    if (form === 'signUp') {
      if (password !== passwordConfirm) {
        errorMessage.push('Passwords do not match.');
      }
      if (password.length < 8) {
        errorMessage.push('Password must be at least 8 characters.');
      }
    }
    if (errorMessage.length > 0) {
      this.setState({
        errorMessage
      });
    } else {
      axios
        .post(url, {
          email: email,
          password: password
        })
        .then(() => {
          splashClass.props.history.push('/account/dashboard');
        })
        .catch(error => {
          errorMessage = [error.message];
        });
    }
  }
  handleSwitchForm(e) {
    e.preventDefault();

    let form = this.state.form === 'login' ? 'signUp' : 'login';

    this.setState({
      form
    });
  }
  render() {
    return (
      <section id="account">
        <div id="account-center">
          <div id="center-box">
            <form onSubmit={this.handleSubmit}>
              <input
                id="email"
                placeholder="EMAIL"
                type="text"
                autoComplete="off"
                value={this.state.email}
                onChange={this.handleChange}
              />
              <input
                id="password"
                placeholder="PASSWORD"
                type="password"
                autoComplete="off"
                value={this.state.password}
                onChange={this.handleChange}
              />
              {this.state.form === 'signUp' ? (
                <input
                  id="passwordConfirm"
                  placeholder="CONFIRM PASSWORD"
                  type="password"
                  autoComplete="off"
                  value={this.state.passwordConfirm}
                  onChange={this.handleChange}
                />
              ) : null}
              {this.state.errorMessage.map((errorMessage, index) => {
                return (
                  <p key={index} className="error">
                    {errorMessage}
                  </p>
                );
              })}
              <input
                type="submit"
                value={this.state.form === 'login' ? 'LOGIN' : 'SIGN UP'}
              />
              <p>
                Don‘t have an account?{' '}
                <button className="switch-form" onClick={this.handleSwitchForm}>
                  {this.state.form === 'login' ? 'Sign Up' : 'Login'}
                </button>
              </p>
            </form>
          </div>
        </div>
      </section>
    );
  }
}

export default Account;

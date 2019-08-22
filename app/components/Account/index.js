import React from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Dashboard from './Dashboard';
import Login from './Login';

class Account extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      form: 'login',
      email: '',
      password: '',
      passwordConfirm: '',
      isLoggedIn: 'false',
      errorMessage: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSwitchForm = this.handleSwitchForm.bind(this);
  }
  componentDidMount() {
    axios.post('/api/user/validate').then(() => {
      this.setState({
        isLoggedIn: !!Cookies.get('auth')
      });
    });
  }
  handleChange(event) {
    let value = event.target.value;
    let newState = {};

    newState[event.target.id] = value;
    this.setState(newState);
  }
  handleSubmit(e) {
    e.preventDefault();

    const thisComponent = this;
    let form = this.state.form;
    let errorMessage = [];
    let email = this.state.email;
    let password = this.state.password;
    let passwordConfirm = this.state.passwordConfirm;
    let splashClass = this;
    const url = form === 'login' ? '/api/user/login' : '/api/user/signup';

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
      axios({
        url: url,
        method: 'post',
        params: {
          email: email,
          password: password
        }
      })
        .then(() => {
          this.setState({
            isLoggedIn: true
          });
        })
        .catch(error => {
          errorMessage.push(error.response.data);
          thisComponent.setState({
            errorMessage
          });
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
        {this.state.isLoggedIn ? (
          <Dashboard />
        ) : (
          <Login
            handleChange={this.handleChange}
            handleSubmit={this.handleSubmit}
            handleSwitchForm={this.handleSwitchForm}
            form={this.state.form}
            email={this.state.email}
            password={this.state.password}
            passwordConfirm={this.state.passwordConfirm}
            errorMessage={this.state.errorMessage}
          />
        )}
      </section>
    );
  }
}

export default Account;

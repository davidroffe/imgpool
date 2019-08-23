import React from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Dashboard from './Dashboard';
import Login from './Login';
import Edit from './Edit';
import Modal from '../Utility/Modal';

class Account extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      form: 'login',
      email: '',
      username: '',
      password: '',
      passwordConfirm: '',
      edit: {
        username: '',
        password: '',
        passwordConfirm: ''
      },
      isLoggedIn: 'false',
      editField: '',
      showModal: false,
      errorMessage: []
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSwitchForm = this.handleSwitchForm.bind(this);
    this.handleEditAccount = this.handleEditAccount.bind(this);
  }
  componentDidMount() {
    axios.post('/api/user/validate').then(res => {
      this.setState({
        username: res.data.username,
        email: res.data.email,
        isLoggedIn: !!Cookies.get('auth')
      });
    });
  }
  handleChange(event) {
    let value = event.target.value;
    let newState = {};
    const inputEl = event.target;

    newState[inputEl.id] = value;

    this.setState(
      inputEl.parentElement.id === 'edit-form' ? { edit: newState } : newState
    );
  }
  handleSubmit(e) {
    e.preventDefault();

    const thisComponent = this;
    let form = this.state.form;
    let errorMessage = [];
    let email = this.state.email;
    let username = this.state.username;
    let password = this.state.password;
    let passwordConfirm = this.state.passwordConfirm;
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
          username: username,
          password: password
        }
      })
        .then(res => {
          this.setState({
            email: res.data.email,
            username: res.data.username,
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
  handleEditAccount(e) {
    e.preventDefault();

    this.setState({
      editField: e.target.id,
      showModal: true
    });
  }
  handleClick(e) {
    if (e.target.id === 'modal-container') {
      this.setState({
        showModal: false,
        edit: {
          username: '',
          password: '',
          passwordConfirm: ''
        }
      });
    }
  }
  render() {
    return (
      <section id="account">
        {this.state.isLoggedIn ? (
          <Dashboard
            handleEditAccount={this.handleEditAccount}
            email={this.state.email}
            username={this.state.username}
          />
        ) : (
          <Login
            handleChange={this.handleChange}
            handleSubmit={this.handleSubmit}
            handleSwitchForm={this.handleSwitchForm}
            form={this.state.form}
            email={this.state.email}
            username={this.state.username}
            password={this.state.password}
            passwordConfirm={this.state.passwordConfirm}
            errorMessage={this.state.errorMessage}
          />
        )}
        {this.state.showModal ? (
          <Modal handleClick={this.handleClick}>
            <Edit
              handleChange={this.handleChange}
              handleSubmit={this.handleSubmit}
              field={this.state.editField}
              email={this.state.edit.email}
              username={this.state.edit.username}
              password={this.state.edit.password}
              passwordConfirm={this.state.edit.passwordConfirm}
              errorMessage={this.state.errorMessage}
            />
          </Modal>
        ) : null}
      </section>
    );
  }
}

export default Account;

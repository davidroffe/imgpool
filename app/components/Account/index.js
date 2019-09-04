import React from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Dashboard from './Dashboard';
import Login from './Login';
import Edit from './Edit';
import CreatePost from './CreatePost';
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
        email: '',
        password: '',
        passwordConfirm: ''
      },
      post: {
        file: '',
        source: '',
        tags: ''
      },
      isLoggedIn: 'false',
      editField: '',
      showModal: false,
      modalContent: '',
      errorMessage: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSwitchForm = this.handleSwitchForm.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleEditSubmit = this.handleEditSubmit.bind(this);
    this.handleCreatePostSubmit = this.handleCreatePostSubmit.bind(this);
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
  handleChange(form = '', event) {
    if (typeof event === 'undefined') event = form;
    const inputEl = event.target;
    let value = inputEl.type === 'file' ? inputEl.files[0] : inputEl.value;
    let newState = {};

    switch (form) {
      case 'edit':
        newState = this.state.edit;
        newState[inputEl.id] = value;
        this.setState({ edit: newState });
        break;
      case 'post':
        newState = this.state.edit;
        newState[inputEl.id] = value;
        this.setState({ post: newState });
        break;
      default:
        newState[inputEl.id] = value;
        this.setState(newState);
    }
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
          password: password,
          passwordConfirm: passwordConfirm
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
  handleEditSubmit(e) {
    e.preventDefault();

    const thisComponent = this;
    const currentEmail = this.state.email;
    const currentUsername = this.state.username;
    const email = this.state.edit.email;
    const username = this.state.edit.username;
    const password = this.state.edit.password;
    const passwordConfirm = this.state.edit.passwordConfirm;
    const editField = this.state.editField;
    const url = '/api/user/edit';
    let errorMessage = [];

    if (editField === 'edit-email') {
      if (email === undefined || email === '') {
        errorMessage.push('Please enter an email.');
      } else if (email === currentEmail) {
        errorMessage.push('Please use a different email.');
      }
    }
    if (editField === 'edit-username') {
      if (username === currentUsername) {
        errorMessage.push('Please use a different username.');
      }
    }
    if (editField === 'edit-password') {
      if (password === undefined || password === '') {
        errorMessage.push('Please enter a password.');
      } else if (password.length < 8) {
        errorMessage.push('Password must be at least 8 characters.');
      } else if (password !== passwordConfirm) {
        errorMessage.push('Passwords do not match.');
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
          currentEmail: currentEmail,
          editField: editField,
          email: email,
          username: username,
          password: password,
          passwordConfirm: passwordConfirm
        }
      })
        .then(res => {
          if (res.data.status === 'success') {
            this.setState({
              email: res.data.email,
              username: res.data.username
            });
          }
        })
        .catch(error => {
          errorMessage.push(error.response.data);
          thisComponent.setState({
            errorMessage
          });
        });
    }
  }
  handleCreatePostSubmit(e) {
    e.preventDefault();

    const thisComponent = this;
    const file = this.state.post.file;
    const source = this.state.post.source;
    const tags = this.state.post.tags;
    const url = '/api/post/create';
    let formData = new FormData();
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    let errorMessage = [];

    if (file === undefined || file === '') {
      errorMessage.push('Please select a file.');
    }
    if (errorMessage.length > 0) {
      this.setState({
        errorMessage
      });
    } else {
      config.params = {
        source: source,
        tags: tags
      };
      formData.append('image', file);
      axios
        .post(url, formData, config)
        .then(res => {
          if (res.data.status === 'success') {
            this.setState({
              showModal: false,
              post: {
                file: null,
                source: '',
                tags: ''
              }
            });
          }
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
  toggleModal(modalContent, e) {
    e = typeof e === 'undefined' ? modalContent : e;
    if (e.target.id === 'modal-container') {
      this.setState({
        showModal: false,
        edit: {
          username: '',
          password: '',
          passwordConfirm: ''
        },
        post: {
          file: null,
          source: '',
          tags: ''
        }
      });
    } else {
      this.setState({
        modalContent: modalContent,
        editField: e.target.id,
        showModal: true
      });
    }
  }
  render() {
    return (
      <section id="account">
        {this.state.isLoggedIn ? (
          <Dashboard
            toggleModal={this.toggleModal}
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
          <Modal toggleModal={this.toggleModal}>
            {this.state.modalContent === 'edit' ? (
              <Edit
                handleChange={this.handleChange}
                handleSubmit={this.handleEditSubmit}
                field={this.state.editField}
                email={this.state.edit.email}
                username={this.state.edit.username}
                password={this.state.edit.password}
                passwordConfirm={this.state.edit.passwordConfirm}
                errorMessage={this.state.errorMessage}
              />
            ) : (
              <CreatePost
                handleChange={this.handleChange}
                handleSubmit={this.handleCreatePostSubmit}
                file={this.state.post.file}
                source={this.state.post.source}
                tags={this.state.post.tags}
                errorMessage={this.state.errorMessage}
              />
            )}
          </Modal>
        ) : null}
      </section>
    );
  }
}

export default Account;

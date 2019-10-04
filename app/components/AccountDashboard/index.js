import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { setUser, setPosts } from '../../actions';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import axios from 'axios';
import CreatePost from './CreatePost';
import EditAccount from './EditAccount';
import DeleteAccount from './DeleteAccount';

const mapStateToProps = state => {
  return {
    email: state.user.email,
    username: state.user.username,
    loggedIn: state.user.loggedIn
  };
};

const Dashboard = props => {
  const [deleteAccount, setDeleteAccount] = useState({
    show: false,
    password: '',
    passwordConfirm: '',
    errorMessage: []
  });
  const [editAccount, setEditAccount] = useState({
    show: false,
    field: '',
    email: '',
    username: '',
    password: '',
    passwordConfirm: '',
    errorMessage: []
  });
  const [createPost, setCreatePost] = useState({
    show: false,
    file: { value: {}, name: '' },
    source: '',
    tags: '',
    errorMessage: []
  });
  useEffect(() => {
    axios.post('/api/user/validate').then(res => {
      if (res.data.valid) {
        props.dispatch(setUser('username', res.data.username));
        props.dispatch(setUser('email', res.data.email));
        props.dispatch(setUser('loggedIn', !!Cookies.get('auth')));
        props.dispatch(setUser('admin', res.data.admin));
      } else if (!props.loggedIn) {
        Cookies.remove('auth');
        props.history.push('/login');
        window.location.reload();
      }
    });
  }, []);
  const logout = e => {
    e.preventDefault();

    axios.post('/api/user/logout').then(() => {
      Cookies.remove('auth');
      window.location.reload();
    });
  };
  const clearValues = () => {
    setEditAccount({
      show: false,
      field: '',
      email: '',
      username: '',
      password: '',
      passwordConfirm: '',
      errorMessage: []
    });
    setDeleteAccount({
      show: false,
      password: '',
      passwordConfirm: '',
      errorMessage: []
    });
    setCreatePost({
      show: false,
      file: { value: {}, name: '' },
      source: '',
      tags: '',
      errorMessage: []
    });
  };
  const handleChange = (form, field, e) => {
    let newObject;

    switch (form) {
      case 'editAccount':
        newObject = { ...editAccount };
        newObject[field] = e.target.value;
        setEditAccount(newObject);
        break;
      case 'deleteAccount':
        newObject = { ...deleteAccount };
        newObject[field] = e.target.value;
        setDeleteAccount(newObject);
        break;
      case 'createPost':
        newObject = { ...createPost };
        if (field === 'file') {
          newObject[field].name = e.target.value;
          newObject[field].value = e.target.files[0];
        } else {
          newObject[field] = e.target.value;
        }
        setCreatePost(newObject);
        break;
    }
  };
  const handleEditSubmit = e => {
    e.preventDefault();

    const url = '/api/user/edit';
    let newErrorMessage = [];

    if (editAccount.field === 'edit-email') {
      if (editAccount.email === undefined || editAccount.email === '') {
        newErrorMessage.push('Please enter an email.');
      } else if (editAccount.email === props.email) {
        newErrorMessage.push('Please use a different email.');
      }
    }
    if (editAccount.field === 'edit-username') {
      if (editAccount.username === undefined || editAccount.username === '') {
        newErrorMessage.push('Please enter a username.');
      } else if (editAccount.username === props.username) {
        newErrorMessage.push('Please use a different username.');
      }
    }
    if (editAccount.field === 'edit-password') {
      if (editAccount.password === undefined || editAccount.password === '') {
        newErrorMessage.push('Please enter a password.');
      } else if (editAccount.password.length < 8) {
        newErrorMessage.push('Password must be at least 8 characters.');
      } else if (editAccount.passwordConfirm !== editAccount.password) {
        newErrorMessage.push('Passwords do not match.');
      }
    }
    if (newErrorMessage.length > 0) {
      setEditAccount({ ...editAccount, errorMessage: newErrorMessage });
    } else {
      axios({
        url: url,
        method: 'post',
        params: {
          currentEmail: props.email,
          editField: editAccount.field,
          email: editAccount.email,
          username: editAccount.username,
          password: editAccount.password,
          passwordConfirm: editAccount.passwordConfirm
        }
      })
        .then(res => {
          if (res.data.status === 'success') {
            props.dispatch(setUser('email', res.data.email));
            props.dispatch(setUser('username', res.data.username));

            setEditAccount({
              show: false,
              field: '',
              email: '',
              username: '',
              password: '',
              passwordConfirm: '',
              errorMessage: []
            });
          }
        })
        .catch(error => {
          setEditAccount({ ...editAccount, errorMessage: [error.data] });
        });
    }
  };
  const handleDeleteAccountSubmit = e => {
    e.preventDefault();

    const url = '/api/user/delete/self';
    let newErrorMessage = [];

    if (deleteAccount.password === undefined || deleteAccount.password === '') {
      newErrorMessage.push('Please enter a password.');
    } else if (deleteAccount.password.length < 8) {
      newErrorMessage.push('Password must be at least 8 characters.');
    } else if (deleteAccount.passwordConfirm !== deleteAccount.password) {
      newErrorMessage.push('Passwords do not match.');
    }

    if (newErrorMessage.length > 0) {
      setDeleteAccount({ ...deleteAccount, errorMessage: newErrorMessage });
    } else {
      axios({
        url: url,
        method: 'post',
        params: {
          password: deleteAccount.password
        }
      })
        .then(() => {
          props.dispatch(setUser('username', ''));
          props.dispatch(setUser('email', ''));
          props.dispatch(setUser('loggedIn', false));
          Cookies.remove('auth');
          window.location.reload();
        })
        .catch(error => {
          setDeleteAccount({ ...deleteAccount, errorMessage: [error.data] });
        });
    }
  };

  const handleCreatePostSubmit = e => {
    e.preventDefault();

    const url = '/api/post/create';
    let formData = new FormData();
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    let newErrorMessage = [];

    if (createPost.file === undefined || createPost.file === '') {
      newErrorMessage.push('Please select a file.');
    }
    if (createPost.tags.split(' ').length < 4) {
      newErrorMessage.push(
        'Minimum 4 space separated tags. ie: red race_car bmw m3'
      );
    }
    if (newErrorMessage.length > 0) {
      setCreatePost({ ...createPost, errorMessage: newErrorMessage });
    } else {
      config.params = {
        source: createPost.source,
        tags: createPost.tags
      };
      formData.append('image', createPost.file.value);
      axios
        .post(url, formData, config)
        .then(res => {
          if (res.data.status === 'success') {
            clearValues();
            props.dispatch(setPosts([]));
          }
        })
        .catch(error => {
          setCreatePost({ ...createPost, errorMessage: [error.data] });
        });
    }
  };
  return (
    <section id="account-dashboard">
      <h1>
        <span>Account</span>
      </h1>
      <div className="left">
        <h2>Username</h2>
        <div className="row">
          <p>{props.username}</p>
          <button
            id="edit-username"
            onClick={() =>
              setEditAccount({
                ...editAccount,
                show: true,
                field: 'edit-username'
              })
            }
          >
            edit
          </button>
        </div>
        <h2>Email</h2>
        <div className="row">
          <p>{props.email}</p>
          <button
            id="edit-email"
            onClick={() =>
              setEditAccount({
                ...editAccount,
                show: true,
                field: 'edit-email'
              })
            }
          >
            edit
          </button>
        </div>
        <h2>Password</h2>
        <div className="row">
          <p>hidden</p>
          <button
            id="edit-password"
            onClick={() =>
              setEditAccount({
                ...editAccount,
                show: true,
                field: 'edit-password'
              })
            }
          >
            edit
          </button>
        </div>
      </div>
      <div className="right">
        <button
          className="border-button"
          id="create-post"
          onClick={() =>
            setCreatePost({
              ...createPost,
              show: true
            })
          }
        >
          Create Post
        </button>
        <button className="border-button" id="logout" onClick={logout}>
          Log Out
        </button>
        <button
          className="border-button-red"
          id="delete-account"
          onClick={() =>
            setDeleteAccount({
              ...deleteAccount,
              show: true
            })
          }
        >
          Delete Account
        </button>
      </div>
      <EditAccount
        handleSubmit={handleEditSubmit}
        handleChange={handleChange}
        clearValues={clearValues}
        setData={setEditAccount}
        data={editAccount}
      />
      <DeleteAccount
        handleSubmit={handleDeleteAccountSubmit}
        handleChange={handleChange}
        clearValues={clearValues}
        setData={setDeleteAccount}
        data={deleteAccount}
      />
      <CreatePost
        handleSubmit={handleCreatePostSubmit}
        handleChange={handleChange}
        clearValues={clearValues}
        setData={setCreatePost}
        data={createPost}
      />
    </section>
  );
};

Dashboard.propTypes = {
  history: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  email: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired
};

export default connect(mapStateToProps)(Dashboard);

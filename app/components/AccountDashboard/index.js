import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { setUser, setPosts } from '../../actions';
import PropTypes from 'prop-types';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import CreatePost from './CreatePost';
import EditAccount from './EditAccount';
import Loader from '../Utility/Loader';

const mapStateToProps = state => {
  return {
    email: state.user.email,
    username: state.user.username,
    bio: state.user.bio,
    loggedIn: state.user.loggedIn,
    userInit: state.user.init
  };
};

const Dashboard = props => {
  const [editAccount, setEditAccount] = useState({
    show: false,
    field: '',
    email: '',
    username: '',
    password: '',
    passwordConfirm: '',
    bio: ''
  });
  const [createPost, setCreatePost] = useState({
    show: false,
    file: { value: {}, name: '' },
    source: '',
    tags: ''
  });
  useEffect(() => {
    if (props.userInit) {
      if (!props.loggedIn) {
        props.history.push('/login');
      } else {
        clearValues();
      }
    }
  }, [props]);
  const logout = e => {
    e.preventDefault();

    axios.post('/api/user/logout').then(() => {
      window.location.reload();
    });
  };
  const clearValues = () => {
    setEditAccount({
      show: false,
      field: '',
      email: '',
      username: '',
      bio: props.bio,
      password: '',
      passwordConfirm: ''
    });
    setCreatePost({
      show: false,
      file: { value: {}, name: '' },
      source: '',
      tags: ''
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
    if (editAccount.field === 'edit-bio') {
      if (editAccount.bio === undefined) {
        newErrorMessage.push('Error with bio.');
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
      newErrorMessage.forEach(error => {
        toast.error(error);
      });
    } else {
      axios({
        url: url,
        method: 'post',
        params: {
          currentEmail: props.email,
          editField: editAccount.field,
          email: editAccount.email,
          username: editAccount.username,
          bio: editAccount.bio,
          password: editAccount.password,
          passwordConfirm: editAccount.passwordConfirm
        }
      })
        .then(res => {
          if (res.data.status === 'success') {
            props.dispatch(setUser('email', res.data.email));
            props.dispatch(setUser('username', res.data.username));
            props.dispatch(setUser('bio', res.data.bio));

            setEditAccount({
              show: false,
              field: '',
              email: '',
              username: '',
              bio: res.data.bio,
              password: '',
              passwordConfirm: ''
            });
          }
        })
        .catch(error => {
          toast.error(error.response.data);
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

    if (createPost.file.name === undefined || createPost.file.name === '') {
      newErrorMessage.push('Please select a file.');
    }
    if (createPost.tags.split(' ').length < 4) {
      newErrorMessage.push(
        'Minimum 4 space separated tags. ie: red race_car bmw m3'
      );
    }
    if (newErrorMessage.length > 0) {
      newErrorMessage.forEach(error => {
        toast.error(error);
      });
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
            props.dispatch(setPosts({ list: [], offset: 0 }));
          }
        })
        .catch(error => {
          toast.error(error.response.data);
        });
    }
  };
  return (
    <section className="container dashboard" id="account-dashboard">
      <ToastContainer />
      {props.userInit && props.loggedIn ? (
        <div className="inner">
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
            <h2>Bio</h2>
            <div className="row">
              {props.bio ? <p>{props.bio}</p> : null}
              <button
                id="edit-bio"
                onClick={() =>
                  setEditAccount({
                    ...editAccount,
                    show: true,
                    field: 'edit-bio'
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
          </div>
          <EditAccount
            handleSubmit={handleEditSubmit}
            handleChange={handleChange}
            clearValues={clearValues}
            setData={setEditAccount}
            data={editAccount}
          />
          <CreatePost
            handleSubmit={handleCreatePostSubmit}
            handleChange={handleChange}
            clearValues={clearValues}
            setData={setCreatePost}
            data={createPost}
          />
        </div>
      ) : null}
      <Loader show={!props.userInit && !props.loggedIn} />
    </section>
  );
};

Dashboard.propTypes = {
  history: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  userInit: PropTypes.bool.isRequired,
  email: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  bio: PropTypes.string.isRequired
};

export default connect(mapStateToProps)(Dashboard);

import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setUser, setPosts } from '../../actions';
import axios from 'axios';
import Cookies from 'js-cookie';
import Dashboard from './Dashboard';
import Login from './Login';
import Edit from './Edit';
import CreatePost from './CreatePost';
import Modal from '../Utility/Modal';
import DeleteAccount from './Delete';
import PasswordReset from './PasswordReset';

const mapStateToProps = state => {
  return {
    email: state.user.email,
    username: state.user.username,
    loggedIn: state.user.loggedIn
  };
};

const Account = props => {
  const [deletePassword, setDeletePassword] = useState('');
  const [deletePasswordConfirm, setDeletePasswordConfirm] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editPasswordConfirm, setEditPasswordConfirm] = useState('');
  const [passwordResetPassword, setPasswordResetPassword] = useState('');
  const [
    passwordResetPasswordConfirm,
    setPasswordResetPasswordConfirm
  ] = useState('');
  const [postFile, setPostFile] = useState('');
  const [postSource, setPostSource] = useState('');
  const [postTags, setPostTags] = useState('');
  const [editField, setEditField] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [errorMessage, setErrorMessage] = useState([]);

  useEffect(() => {
    axios.post('/api/user/validate').then(res => {
      if (res.data.valid) {
        props.dispatch(setUser('username', res.data.username));
        props.dispatch(setUser('email', res.data.email));
        props.dispatch(setUser('loggedIn', !!Cookies.get('auth')));
      } else if (props.loggedIn) {
        Cookies.remove('auth');
        window.location.reload();
      }
    });
  }, []);

  const logout = e => {
    e.preventDefault();

    axios.post('/api/user/logout').then(() => {
      props.dispatch(setUser('username', ''));
      props.dispatch(setUser('email', ''));
      props.dispatch(setUser('loggedIn', false));
      Cookies.remove('auth');
      window.location.reload();
    });
  };

  const handleEditSubmit = e => {
    e.preventDefault();

    const url = '/api/user/edit';
    let newErrorMessage = [];

    if (editField === 'edit-email') {
      if (editEmail === undefined || editEmail === '') {
        newErrorMessage.push('Please enter an email.');
      } else if (editEmail === props.email) {
        newErrorMessage.push('Please use a different email.');
      }
    }
    if (editField === 'edit-username') {
      if (editUsername === undefined || editUsername === '') {
        newErrorMessage.push('Please enter a username.');
      } else if (editUsername === props.username) {
        newErrorMessage.push('Please use a different username.');
      }
    }
    if (editField === 'edit-password') {
      if (editPassword === undefined || editPassword === '') {
        newErrorMessage.push('Please enter a password.');
      } else if (editPassword.length < 8) {
        newErrorMessage.push('Password must be at least 8 characters.');
      } else if (editPasswordConfirm !== editPassword) {
        newErrorMessage.push('Passwords do not match.');
      }
    }
    if (newErrorMessage.length > 0) {
      setErrorMessage(newErrorMessage);
    } else {
      axios({
        url: url,
        method: 'post',
        params: {
          currentEmail: props.email,
          editField: editField,
          email: editEmail,
          username: editUsername,
          password: editPassword,
          passwordConfirm: editPasswordConfirm
        }
      })
        .then(res => {
          if (res.data.status === 'success') {
            props.dispatch(setUser('email', res.data.email));
            props.dispatch(setUser('username', res.data.username));

            setShowModal(false);
            setEditField('');
            setEditEmail('');
            setEditUsername('');
            setEditPassword('');
            setEditPasswordConfirm('');
            setErrorMessage([]);
          }
        })
        .catch(error => {
          setErrorMessage(error.data);
        });
    }
  };

  const handleDeleteAccountSubmit = e => {
    e.preventDefault();

    const url = '/api/user/delete';
    let newErrorMessage = [];

    if (deletePassword === undefined || deletePassword === '') {
      newErrorMessage.push('Please enter a password.');
    } else if (deletePassword.length < 8) {
      newErrorMessage.push('Password must be at least 8 characters.');
    } else if (deletePasswordConfirm !== deletePassword) {
      newErrorMessage.push('Passwords do not match.');
    }

    if (newErrorMessage.length > 0) {
      setErrorMessage(newErrorMessage);
    } else {
      axios({
        url: url,
        method: 'post',
        params: {
          password: deletePassword
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
          setErrorMessage([error.response.data]);
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

    if (postFile === undefined || postFile === '') {
      newErrorMessage.push('Please select a file.');
    }
    if (postTags.split(' ').length < 4) {
      newErrorMessage.push(
        'Minimum 4 space separated tags. ie: red race_car bmw m3'
      );
    }
    if (newErrorMessage.length > 0) {
      setErrorMessage(newErrorMessage);
    } else {
      config.params = {
        source: postSource,
        tags: postTags
      };
      formData.append('image', postFile);
      axios
        .post(url, formData, config)
        .then(res => {
          if (res.data.status === 'success') {
            setShowModal(false);
            setPostFile(null);
            setPostSource('');
            setPostTags('');
            props.dispatch(setPosts([]));
          }
        })
        .catch(error => {
          setErrorMessage([error.data]);
        });
    }
  };

  const handlePasswordResetSubmit = e => {
    e.preventDefault();

    let newErrorMessage = [];
    const url = '/api/user/password-reset';

    if (passwordResetPassword !== passwordResetPasswordConfirm) {
      newErrorMessage.push('Passwords do not match.');
    }
    if (passwordResetPassword.length < 8) {
      newErrorMessage.push('Password must be at least 8 characters.');
    }
    if (newErrorMessage.length > 0) {
      setErrorMessage(newErrorMessage);
    } else {
      axios({
        url: url,
        method: 'post',
        params: {
          passwordResetToken: props.match.params.passwordResetToken,
          password: passwordResetPassword
        }
      })
        .then(res => {
          props.dispatch(setUser('email', res.data.email));
          props.dispatch(setUser('username', res.data.username));
          props.dispatch(setUser('loggedIn', true));
          props.history.push('/account');
        })
        .catch(error => {
          setErrorMessage([error.response.data]);
        });
    }
  };

  const toggleModal = (modalContent, e) => {
    e = typeof e === 'undefined' ? modalContent : e;

    if (e.target.id === 'modal-container') {
      setShowModal(false);
      setEditUsername('');
      setEditPassword('');
      setEditPasswordConfirm('');
      setPostFile(null);
      setPostSource('');
      setPostTags('');
    } else if (typeof modalContent === 'string') {
      setModalContent(modalContent);
      setEditField(e.target.id);
      setShowModal(true);
    }

    setErrorMessage([]);
  };
  return (
    <section id="account">
      {(() => {
        if (props.loggedIn) {
          return <Dashboard toggleModal={toggleModal} logout={logout} />;
        } else if (props.match.params.passwordResetToken) {
          return (
            <PasswordReset
              handleSubmit={handlePasswordResetSubmit}
              setPassword={setPasswordResetPassword}
              setPasswordConfirm={setPasswordResetPasswordConfirm}
              password={passwordResetPassword}
              passwordConfirm={passwordResetPasswordConfirm}
              errorMessage={errorMessage}
            />
          );
        } else {
          return <Login />;
        }
      })()}

      {showModal ? (
        <Modal toggleModal={toggleModal}>
          {(() => {
            switch (modalContent) {
              case 'edit':
                return (
                  <Edit
                    handleSubmit={handleEditSubmit}
                    setEditEmail={setEditEmail}
                    setEditUsername={setEditUsername}
                    setEditPassword={setEditPassword}
                    setEditPasswordConfirm={setEditPasswordConfirm}
                    field={editField}
                    email={editEmail}
                    username={editUsername}
                    password={editPassword}
                    passwordConfirm={editPasswordConfirm}
                    errorMessage={errorMessage}
                  />
                );
              case 'deleteAccount':
                return (
                  <DeleteAccount
                    handleSubmit={handleDeleteAccountSubmit}
                    setPassword={setDeletePassword}
                    setPasswordConfirm={setDeletePasswordConfirm}
                    password={deletePassword}
                    passwordConfirm={deletePasswordConfirm}
                    errorMessage={errorMessage}
                  />
                );
              default:
                return (
                  <CreatePost
                    handleSubmit={handleCreatePostSubmit}
                    setPostFile={setPostFile}
                    setPostSource={setPostSource}
                    setPostTags={setPostTags}
                    file={postFile}
                    source={postSource}
                    tags={postTags}
                    errorMessage={errorMessage}
                  />
                );
            }
          })()}
        </Modal>
      ) : null}
    </section>
  );
};

Account.propTypes = {
  dispatch: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(Account);

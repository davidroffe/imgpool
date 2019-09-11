import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Dashboard from './Dashboard';
import Login from './Login';
import Edit from './Edit';
import CreatePost from './CreatePost';
import Modal from '../Utility/Modal';

const Account = props => {
  const [form, setForm] = useState('login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editPasswordConfirm, setEditPasswordConfirm] = useState('');
  const [postFile, setPostFile] = useState('');
  const [postSource, setPostSource] = useState('');
  const [postTags, setPostTags] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState('false');
  const [editField, setEditField] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [errorMessage, setErrorMessage] = useState([]);

  useEffect(() => {
    axios.post('/api/user/validate').then(res => {
      setUsername(res.data.username || '');
      setEmail(res.data.email || '');
      setIsLoggedIn(!!Cookies.get('auth'));
    });
  }, []);

  const handleLoginSignUpSubmit = e => {
    e.preventDefault();

    let newErrorMessage = [];
    let passwordConfirm = passwordConfirm;
    const url = form === 'login' ? '/api/user/login' : '/api/user/signup';

    if (email === undefined || email === '') {
      newErrorMessage.push('Please enter an email.');
    }
    if (password === undefined || password === '') {
      newErrorMessage.push('Please enter a password.');
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
          setEmail(res.data.email);
          setUsername(res.data.username);
          setIsLoggedIn(true);
        })
        .catch(error => {
          setErrorMessage(error.response.data);
        });
    }
  };
  const handleEditSubmit = e => {
    e.preventDefault();

    const url = '/api/user/edit';
    let newErrorMessage = [];

    if (editField === 'edit-email') {
      if (editEmail === undefined || editEmail === '') {
        newErrorMessage.push('Please enter an email.');
      } else if (editEmail === email) {
        newErrorMessage.push('Please use a different email.');
      }
    }
    if (editField === 'edit-username') {
      if (editUsername === undefined || editUsername === '') {
        newErrorMessage.push('Please enter a username.');
      } else if (editUsername === username) {
        newErrorMessage.push('Please use a different username.');
      }
    }
    if (editField === 'edit-password') {
      if (editPassword === undefined || editPassword === '') {
        newErrorMessage.push('Please enter a password.');
      } else if (editPassword.length < 8) {
        newErrorMessage.push('Password must be at least 8 characters.');
      } else if (editPasswordConfirm !== passwordConfirm) {
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
          currentEmail: email,
          editField: editField,
          email: editEmail,
          username: editUsername,
          password: editPassword,
          passwordConfirm: editPasswordConfirm
        }
      })
        .then(res => {
          if (res.data.status === 'success') {
            setEmail(res.data.email);
            setUsername(res.data.username);

            setShowModal(false);
            setEditField('');
            setEditEmail('');
            setEditUsername('');
            setEditPassword('');
            setEditPasswordConfirm('');
          }
        })
        .catch(error => {
          setErrorMessage(error.response.data);
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
          }
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
  };
  return (
    <section id="account">
      {isLoggedIn ? (
        <Dashboard
          toggleModal={toggleModal}
          email={email}
          username={username}
        />
      ) : (
        <Login
          handleSubmit={handleLoginSignUpSubmit}
          setEmail={setEmail}
          setUsername={setUsername}
          setPassword={setPassword}
          setPasswordConfirm={setPasswordConfirm}
          setForm={setForm}
          form={form}
          email={email}
          username={username}
          password={password}
          passwordConfirm={passwordConfirm}
          errorMessage={errorMessage}
        />
      )}
      {showModal ? (
        <Modal toggleModal={toggleModal}>
          {modalContent === 'edit' ? (
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
          ) : (
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
          )}
        </Modal>
      ) : null}
    </section>
  );
};

export default Account;

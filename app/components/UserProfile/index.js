import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { setPosts, setSearch } from '../../actions';
import PropTypes from 'prop-types';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import EditAccount from './EditAccount';
import Loader from '../Utility/Loader';

const mapStateToProps = state => {
  return {
    loggedIn: state.user.loggedIn,
    admin: state.user.admin,
    userInit: state.user.init
  };
};

const Dashboard = props => {
  const [editAccount, setEditAccount] = useState({
    show: false,
    field: '',
    email: '',
    username: '',
    bio: ''
  });
  const [user, setUser] = useState({
    username: '',
    email: '',
    joinDate: '',
    favorites: '',
    bio: ''
  });
  useEffect(() => {
    axios
      .get(`/api/user/get/${props.match.params.id}`)
      .then(res => {
        if (res.data.valid) {
          setUser({
            ...res.data,
            favorites: res.data.favoritedPosts,
            joinDate: new Date(res.data.joinDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          });
        }
      })
      .catch(() => props.history.push('/404'));
  }, []);
  const clearValues = () => {
    setEditAccount({
      show: false,
      field: '',
      email: '',
      username: '',
      bio: '',
      password: '',
      passwordConfirm: ''
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
    }
  };
  const handleEditSubmit = e => {
    e.preventDefault();

    const url = `/api/user/edit/${user.id}`;
    let newErrorMessage = [];

    if (editAccount.field === 'edit-email') {
      if (editAccount.email === undefined || editAccount.email === '') {
        newErrorMessage.push('Please enter an email.');
      } else if (editAccount.email === user.email) {
        newErrorMessage.push('Please use a different email.');
      }
    }
    if (editAccount.field === 'edit-username') {
      if (editAccount.username === undefined || editAccount.username === '') {
        newErrorMessage.push('Please enter a username.');
      } else if (editAccount.username === user.username) {
        newErrorMessage.push('Please use a different username.');
      }
    }
    if (editAccount.field === 'edit-bio') {
      if (editAccount.bio === undefined) {
        newErrorMessage.push('Error with bio.');
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
          currentEmail: user.email,
          editField: editAccount.field,
          email: editAccount.email,
          username: editAccount.username,
          bio: editAccount.bio
        }
      })
        .then(res => {
          if (res.data.status === 'success') {
            setUser({
              ...user,
              email: res.data.email,
              username: res.data.username,
              bio: res.data.bio
            });

            setEditAccount({
              show: false,
              field: '',
              email: '',
              username: '',
              bio: '',
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

  const resetPassword = () => {
    const url = `/api/user/password-reset/${user.id}`;
    axios({
      url: url,
      method: 'post'
    }).then(() => {});
  };

  const handleToggleAccountSubmit = e => {
    e.preventDefault();

    const url = `/api/user/${user.active ? 'disable' : 'enable'}/${user.id}`;

    axios({
      url: url,
      method: 'post'
    })
      .then(res => {
        setUser({
          ...user,
          active: res.data.active
        });
      })
      .catch(error => {
        toast.error(error.response.data);
      });
  };

  const handleFavoritesClick = e => {
    e.preventDefault();

    const userId = user.id;
    const searchQuery = `fp:${userId}`;
    const url = '/api/post/search';

    props.dispatch(setSearch(searchQuery));
    axios.get(url, { params: { searchQuery: searchQuery } }).then(res => {
      props.dispatch(setPosts(res.data));
      props.history.push('/posts');
    });
  };

  return (
    <section className="container dashboard" id="account-dashboard">
      <ToastContainer />
      {props.userInit ? (
        <div className="inner">
          <h1>
            <span>User</span>
          </h1>
          <div className="left">
            <div className="row">
              <h2>Join Date</h2>
              <p>{user.joinDate}</p>
            </div>
            <div className="row">
              <h2>Username</h2>
              <p>{user.username}</p>
              {props.admin ? (
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
              ) : null}
            </div>
            {props.admin ? (
              <div className="row">
                <h2>Email</h2>
                <p>{user.email}</p>
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
            ) : null}
            {props.admin ? (
              <div className="row">
                <h2>Password</h2>
                <p>hidden</p>
                <button id="edit-password" onClick={resetPassword}>
                  reset
                </button>
              </div>
            ) : null}
            <div className="row">
              <h2>Favorites</h2>
              <p>{user.favorites.length} favorites</p>
              <button onClick={handleFavoritesClick}>view</button>
            </div>
            <div className="row">
              <h2>Bio</h2>
              {user.bio ? <p>{user.bio}</p> : null}
              {props.admin ? (
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
              ) : null}
            </div>
          </div>
          {props.admin ? (
            <div className="right">
              <button
                className={
                  user.active ? 'border-button-red' : 'border-button-green'
                }
                id="toggle-account"
                onClick={handleToggleAccountSubmit}
              >
                {user.active ? 'Disable' : 'Enable'} Account
              </button>
            </div>
          ) : null}
          {props.admin ? (
            <EditAccount
              handleSubmit={handleEditSubmit}
              handleChange={handleChange}
              clearValues={clearValues}
              setData={setEditAccount}
              data={editAccount}
            />
          ) : null}
        </div>
      ) : null}
      <Loader show={!props.userInit} />
    </section>
  );
};

Dashboard.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  userInit: PropTypes.bool.isRequired,
  admin: PropTypes.bool.isRequired
};

export default connect(mapStateToProps)(Dashboard);

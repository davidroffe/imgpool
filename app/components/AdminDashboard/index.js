import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { setTags, setUsers, setFlags } from '../../actions';
import axios from 'axios';
import PropTypes from 'prop-types';
import TagForm from './TagForm';
import UserSelectForm from './UserSelectForm';

const mapStateToProps = state => {
  return {
    loggedIn: state.user.loggedIn,
    admin: state.user.admin,
    tags: state.tags,
    users: state.users,
    flags: state.flags
  };
};

const Dashboard = props => {
  const [showFlagForm, setShowFlagForm] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showTagForm, setShowTagForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState([]);

  useEffect(() => {
    if (!props.loggedIn || !props.admin) {
      props.history.push('/account');
    } else {
      if (!props.tags.length) {
        retrieveTags();
      }
      if (!props.users.length) {
        retrieveUsers();
      }
      if (!props.flags.length) {
        retrieveflags();
      }
    }
  });

  const retrieveTags = () => {
    axios.get('/api/tag/get').then(res => {
      props.dispatch(setTags(res.data.length ? res.data : [false]));
    });
  };

  const retrieveUsers = () => {
    axios.get('/api/user/get').then(res => {
      props.dispatch(setUsers(res.data.length ? res.data : [false]));
    });
  };

  const retrieveflags = () => {
    axios.get('/api/post/flag/get/').then(res => {
      props.dispatch(setFlags(res.data.length ? res.data : [false]));
    });
  };

  const toggleSignup = e => {
    e.preventDefault();
  };

  const handleTagSubmit = (url, tagIds) => {
    if (tagIds.length) {
      axios({
        url: url,
        method: 'post',
        params: {
          tagIds: tagIds
        }
      })
        .then(() => {
          retrieveTags();
          setShowTagForm(!showTagForm);
        })
        .catch(error => {
          setErrorMessage([error.response.data]);
        });
    } else {
      setErrorMessage(['Please select one or more tags.']);
    }
  };

  const handleUserSubmit = (url, userIds) => {
    if (userIds.length) {
      axios({
        url: url,
        method: 'post',
        params: {
          tagIds: userIds
        }
      })
        .then(() => {
          retrieveUsers();
          setShowUserForm(!showUserForm);
        })
        .catch(error => {
          setErrorMessage([error.response.data]);
        });
    } else {
      setErrorMessage(['Please select one or more users.']);
    }
  };

  return (
    <section id="account-dashboard">
      <h1>
        <span>Admin</span>
      </h1>
      <div className="left">
        <h2>Flags</h2>
        <div className="row">
          <p>({props.flags[0] ? props.flags.length : '0'})</p>
          {props.flags[0] ? (
            <button
              id="show-flags"
              onClick={() => {
                setShowFlagForm(!showFlagForm);
              }}
            >
              manage
            </button>
          ) : null}
        </div>
        <h2>Users</h2>
        <div className="row">
          <p>({props.users[0] ? props.users.length : '0'})</p>
          {props.users[0] ? (
            <button
              id="show-users"
              onClick={() => {
                setShowUserForm(!showUserForm);
              }}
            >
              manage
            </button>
          ) : null}
        </div>
        <h2>Tags</h2>
        <div className="row">
          <p>({props.tags[0] ? props.tags.length : '0'})</p>
          {props.tags[0] ? (
            <button
              id="show-tags"
              onClick={() => {
                setShowTagForm(!showTagForm);
              }}
            >
              manage
            </button>
          ) : null}
        </div>
      </div>
      <div className="right">
        <button
          className="border-button"
          id="toggle-signup"
          onClick={toggleSignup}
        >
          Toggle Signups
        </button>
      </div>
      <TagForm
        show={showTagForm}
        toggleShow={setShowTagForm}
        handleSubmit={handleTagSubmit}
        tags={props.tags}
        errorMessage={errorMessage}
      />
      <UserSelectForm
        show={showUserForm}
        toggleShow={setShowUserForm}
        handleSubmit={handleUserSubmit}
        users={props.users}
        errorMessage={errorMessage}
      />
    </section>
  );
};

Dashboard.propTypes = {
  dispatch: PropTypes.func.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  admin: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  tags: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
  flags: PropTypes.array.isRequired
};

export default connect(mapStateToProps)(Dashboard);
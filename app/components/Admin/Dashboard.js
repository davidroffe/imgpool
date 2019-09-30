import React, { useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import PropTypes from 'prop-types';
import TagForm from './TagForm';

const mapStateToProps = state => {
  return {
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
          props.retrieveTags();
          setShowTagForm(!showTagForm);
        })
        .catch(error => {
          setErrorMessage([error.response.data]);
        });
    } else {
      setErrorMessage(['Please select one or more tags.']);
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
          onClick={props.toggleSignup}
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
    </section>
  );
};

Dashboard.propTypes = {
  dispatch: PropTypes.func.isRequired,
  retrieveTags: PropTypes.func.isRequired,
  toggleSignup: PropTypes.func.isRequired,
  tags: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
  flags: PropTypes.array.isRequired
};

export default connect(mapStateToProps)(Dashboard);

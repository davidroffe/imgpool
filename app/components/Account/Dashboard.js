import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const mapStateToProps = state => {
  return {
    email: state.user.email,
    username: state.user.username
  };
};

const Dashboard = props => {
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
            onClick={props.toggleModal.bind(this, 'edit')}
          >
            edit
          </button>
        </div>
        <h2>Email</h2>
        <div className="row">
          <p>{props.email}</p>
          <button
            id="edit-email"
            onClick={props.toggleModal.bind(this, 'edit')}
          >
            edit
          </button>
        </div>
        <h2>Password</h2>
        <div className="row">
          <p>hidden</p>
          <button
            id="edit-password"
            onClick={props.toggleModal.bind(this, 'edit')}
          >
            edit
          </button>
        </div>
      </div>
      <div className="right">
        <button
          className="border-button"
          id="create-post"
          onClick={props.toggleModal.bind(this, 'createPost')}
        >
          Create Post
        </button>
        <button className="border-button" id="logout" onClick={props.logout}>
          Log Out
        </button>
        <button
          className="border-button-red"
          id="delete-account"
          onClick={props.toggleModal.bind(this, 'deleteAccount')}
        >
          Delete Account
        </button>
      </div>
    </section>
  );
};

Dashboard.propTypes = {
  logout: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  toggleModal: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(Dashboard);

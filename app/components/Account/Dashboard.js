import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => {
  return {
    email: state.user.email,
    username: state.user.username
  };
};

const Login = props => {
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
        <button className="button-large" id="delete-account">
          Delete Account
        </button>
      </div>
      <div className="right">
        <button
          className="border-button"
          id="create-post"
          onClick={props.toggleModal.bind(this, 'createPost')}
        >
          Create Post
        </button>
      </div>
    </section>
  );
};

export default connect(mapStateToProps)(Login);

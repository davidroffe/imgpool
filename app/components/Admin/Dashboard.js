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
        <span>Admin</span>
      </h1>
      <div className="left">
        <h2>Flagged Posts</h2>
        <div className="row">
          <p>(Total number of flagged posts)</p>
          <button
            id="show-flagged-posts"
            onClick={props.toggleModal.bind(this, 'flaggedPosts')}
          >
            show
          </button>
        </div>
        <h2>Users</h2>
        <div className="row">
          <p>(Total number of users)</p>
          <button
            id="show-users"
            onClick={props.toggleModal.bind(this, 'userList')}
          >
            show
          </button>
        </div>
        <h2>Tags</h2>
        <div className="row">
          <p>(Total number of users)</p>
          <button id="show-tags" onClick={props.toggleModal.bind(this, 'tags')}>
            show
          </button>
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
    </section>
  );
};

Dashboard.propTypes = {
  toggleSignup: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(Dashboard);

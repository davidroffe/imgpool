import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const mapStateToProps = state => {
  return {
    tags: state.tags
  };
};

const Dashboard = props => {
  useEffect(() => {
    props.retrieveTags();
  });

  return (
    <section id="account-dashboard">
      <h1>
        <span>Admin</span>
      </h1>
      <div className="left">
        <h2>Flagged Posts</h2>
        <div className="row">
          <p>({props.tags.length}) Tags</p>
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
  retrieveTags: PropTypes.func.isRequired,
  toggleSignup: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
  tags: PropTypes.array.isRequired
};

export default connect(mapStateToProps)(Dashboard);

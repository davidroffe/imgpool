import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setTags, setUsers, setFlags } from '../../actions';
import axios from 'axios';
import Dashboard from './Dashboard';

const mapStateToProps = state => {
  return {
    loggedIn: state.user.loggedIn,
    admin: state.user.admin,
    tags: state.tags,
    users: state.users,
    flags: state.flags
  };
};

const Admin = props => {
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
  return (
    <section id="account">
      <Dashboard
        retrieveTags={retrieveTags}
        retrieveUsers={retrieveUsers}
        toggleSignup={toggleSignup}
      />
    </section>
  );
};

Admin.propTypes = {
  dispatch: PropTypes.func.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  admin: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  tags: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
  flags: PropTypes.array.isRequired
};

export default connect(mapStateToProps)(Admin);

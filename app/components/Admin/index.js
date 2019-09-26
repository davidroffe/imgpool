import React, { useState, useEffect } from 'react';
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
  //const [errorMessage, setErrorMessage] = useState([]);

  useEffect(() => {
    if (!props.loggedIn || !props.admin) {
      props.history.push('/account');
    } else {
      retrieveTags();
      retrieveUsers();
      retrieveflags();
    }
  });

  const retrieveTags = () => {
    if (!props.tags.length) {
      axios.get('/api/tag/get').then(res => {
        props.dispatch(setTags(res.data.length ? res.data : [false]));
      });
    }
  };

  const retrieveUsers = () => {
    if (!props.users.length) {
      axios.get('/api/user/get').then(res => {
        props.dispatch(setUsers(res.data.length ? res.data : [false]));
      });
    }
  };

  const retrieveflags = () => {
    if (!props.flags.length) {
      axios.get('/api/post/flag/get/').then(res => {
        props.dispatch(setFlags(res.data.length ? res.data : [false]));
      });
    }
  };

  const toggleSignup = e => {
    e.preventDefault();
  };
  return (
    <section id="account">
      <Dashboard toggleSignup={toggleSignup} />
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

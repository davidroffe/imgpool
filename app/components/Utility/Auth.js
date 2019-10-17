import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setUser, clearUser } from '../../actions';
import axios from 'axios';
import AuthContext from '../../context/auth';

const Auth = props => {
  useEffect(() => {
    axios.post('/api/user/get/current').then(res => {
      if (res.data.valid) {
        props.dispatch(setUser('id', res.data.id));
        props.dispatch(setUser('username', res.data.username));
        props.dispatch(setUser('email', res.data.email));
        props.dispatch(setUser('bio', res.data.bio));
        props.dispatch(setUser('loggedIn', true));
        props.dispatch(setUser('admin', res.data.admin));
        props.dispatch(setUser('favorites', res.data.favorites));
        props.dispatch(setUser('init', true));
      } else {
        props.dispatch(clearUser());
      }
    });
  }, [props.location]);

  const isAuthorized = () => {
    axios.post('/api/user/get/current').then(res => {
      if (res.data.valid) {
        props.dispatch(setUser('id', res.data.id));
        props.dispatch(setUser('username', res.data.username));
        props.dispatch(setUser('email', res.data.email));
        props.dispatch(setUser('bio', res.data.bio));
        props.dispatch(setUser('loggedIn', true));
        props.dispatch(setUser('admin', res.data.admin));
        props.dispatch(setUser('favorites', res.data.favorites));
        props.dispatch(setUser('init', true));
      } else {
        props.dispatch(setUser('init', true));
      }
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthorized }}>
      <div>{props.children}</div>
    </AuthContext.Provider>
  );
};

Auth.propTypes = {
  dispatch: PropTypes.func.isRequired,
  children: PropTypes.array.isRequired,
  location: PropTypes.object.isRequired
};

export default withRouter(
  connect(() => {
    return {};
  })(Auth)
);

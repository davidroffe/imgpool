import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setUser } from '../actions';
import axios from 'axios';
import Cookies from 'js-cookie';
import Header from './Header';
import AdminDashboard from './AdminDashboard';
import AccountDashboard from './AccountDashboard';
import UserProfile from './UserProfile';
import PasswordReset from './PasswordReset';
import PostSearch from './PostSearch';
import PostList from './PostList';
import PostSingle from './PostSingle';
import About from './About';
import Login from './Login';

const App = props => {
  useEffect(() => {
    if (Cookies.get('auth')) {
      axios.post('/api/user/get/current').then(res => {
        if (res.data.valid) {
          props.dispatch(setUser('username', res.data.username));
          props.dispatch(setUser('email', res.data.email));
          props.dispatch(setUser('bio', res.data.bio));
          props.dispatch(setUser('loggedIn', !!Cookies.get('auth')));
          props.dispatch(setUser('admin', res.data.admin));
        }
      });
    }
  }, []);
  return (
    <Router>
      <div>
        <Header>
          <PostSearch />
        </Header>
        <Switch>
          <Route path="/posts" exact component={PostList} />
          <Route path="/post/:id" component={PostSingle} />
          <Route path="/account" exact component={AccountDashboard} />
          <Route
            path="/password-reset/:passwordResetToken"
            exact
            component={PasswordReset}
          />
          <Route path="/admin" exact component={AdminDashboard} />
          <Route path="/user/:id" exact component={UserProfile} />
          <Route path="/about" exact component={About} />
          <Route path="/login" exact component={Login} />
          <Redirect from="/" exact to="/posts" />
        </Switch>
      </div>
    </Router>
  );
};

App.propTypes = {
  dispatch: PropTypes.func.isRequired
};

export default connect(() => {
  return {};
})(App);

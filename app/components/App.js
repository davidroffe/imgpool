import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setPostsList } from '../actions';
import axios from 'axios';
import Header from './Header';
import AdminDashboard from './AdminDashboard';
import AccountDashboard from './AccountDashboard';
import UserProfile from './UserProfile';
import PasswordReset from './PasswordReset';
import PostSearch from './PostSearch';
import PostList from './PostList';
import PostSingle from './PostSingle';
import FlagList from './FlagList';
import About from './About';
import Login from './Login';
import Auth from './Utility/Auth';
import NotFound from './NotFound';

const mapStateToProps = state => {
  return { text: state.search };
};

const App = props => {
  const handleSearch = (e, history) => {
    e.preventDefault();

    const searchQuery = props.text;

    const url = searchQuery.length ? '/api/post/search' : '/api/post/list';

    axios.get(url, { params: { searchQuery } }).then(res => {
      props.dispatch(setPostsList(res.data));
      history.push('/posts');
    });
  };
  return (
    <Router>
      <Auth>
        <Header>
          <PostSearch handleSearch={handleSearch} />
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
          <Route path="/flags" exact component={FlagList} />
          <Route path="/about" exact component={About} />
          <Route path="/login" exact component={Login} />
          <Redirect from="/" exact to="/posts" />
          <Route component={NotFound} />
        </Switch>
      </Auth>
    </Router>
  );
};

App.propTypes = {
  text: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(App);

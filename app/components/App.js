import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setPosts, setMenuTags } from '../actions';
import axios from 'axios';
import Header from './Header';
import AdminDashboard from './AdminDashboard';
import AccountDashboard from './AccountDashboard';
import PasswordReset from './PasswordReset';
import PostSearch from './PostSearch';
import PostList from './PostList';
import PostSingle from './PostSingle';
import About from './About';
import Login from './Login';

const mapStateToProps = state => {
  return {
    posts: state.posts,
    tags: state.tagMenu.tags
  };
};

const App = props => {
  const toggleTag = menuTag => {
    props.dispatch(toggleTag(menuTag));
  };

  const retrievePosts = () => {
    if (!props.posts.length) {
      axios.get('/api/post/list').then(res => {
        props.dispatch(setPosts(res.data.length ? res.data : [false]));
        processTags(res.data);
      });
    }
  };

  const processTags = posts => {
    let newTags = [];
    let exists;

    for (var i = 0; i < posts.length; i++) {
      for (var j = 0; j < posts[i].tag.length; j++) {
        exists = false;
        let tag = posts[i].tag[j];

        for (var k = 0; k < newTags.length; k++) {
          if (newTags[k].id === tag.id) {
            exists = true;
          }
        }

        tag.active = false;

        if (!exists) newTags.push(tag);
      }
    }

    props.dispatch(setMenuTags(newTags));
  };

  return (
    <Router>
      <div>
        <Header>
          <PostSearch processTags={processTags} />
        </Header>
        <Switch>
          <Route
            path="/posts"
            exact
            render={() => (
              <PostList retrievePosts={retrievePosts} toggleTag={toggleTag} />
            )}
          />
          <Route
            path="/post/:id"
            render={props => (
              <PostSingle {...props} processTags={processTags} />
            )}
          />
          <Route path="/account" exact component={AccountDashboard} />
          <Route
            path="/password-reset/:passwordResetToken"
            exact
            component={PasswordReset}
          />
          <Route path="/admin" exact component={AdminDashboard} />
          <Route path="/about" exact component={About} />
          <Route path="/login" exact component={Login} />
          <Redirect from="/" exact to="/posts" />
        </Switch>
      </div>
    </Router>
  );
};

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  posts: PropTypes.array.isRequired,
  tags: PropTypes.array.isRequired
};

export default connect(mapStateToProps)(App);

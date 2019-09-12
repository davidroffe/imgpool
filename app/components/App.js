import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setPosts, setTags } from '../actions';
import axios from 'axios';
import Header from './Header';
import Account from './Account/index';
import PostSearch from './Post/Search';
import Posts from './Post/List';
import Post from './Post/Single';
import About from './About';

const mapStateToProps = state => {
  return {
    posts: state.posts,
    tags: state.tags
  };
};

const App = props => {
  const toggleTag = menuTag => {
    props.dispatch(toggleTag(menuTag));
  };

  const retrievePosts = () => {
    if (!props.posts.length) {
      axios.get('/api/post/list').then(res => {
        props.dispatch(setPosts(res.data));
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

    props.dispatch(setTags(newTags));
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
              <Posts retrievePosts={retrievePosts} toggleTag={toggleTag} />
            )}
          />
          <Route
            path="/post/:id"
            render={props => <Post {...props} processTags={processTags} />}
          />
          <Route path="/account" component={Account} />
          <Route path="/about" exact component={About} />
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

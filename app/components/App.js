import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Link
} from 'react-router-dom';
import Account from './Account/index';
import PostList from './Post/List';
import PostSingle from './Post/Single';
import About from './About';
import Logo from '../assets/images/logo.svg';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postList: [],
      tagList: []
    };

    this.setPostList = this.setPostList.bind(this);
    this.processTagList = this.processTagList.bind(this);
    this.toggleTag = this.toggleTag.bind(this);
  }
  toggleTag(tag) {
    let tagList = this.state.tagList;
    for (var i = 0; i < tagList.length; i++) {
      if (tagList[i].id === tag.id)
        tagList[i].active = tagList[i].active ? false : true;
    }
    this.setState({
      tagList
    });
  }
  setPostList(postList) {
    this.setState({ postList });
    this.processTagList(postList);
  }
  processTagList(postList) {
    let tagList = this.state.tagList;
    let exists;

    for (var i = 0; i < postList.length; i++) {
      for (var j = 0; j < postList[i].tag.length; j++) {
        exists = false;
        let tag = postList[i].tag[j];

        for (var k = 0; k < tagList.length; k++) {
          if (tagList[k].id === tag.id) {
            exists = true;
          }
        }

        tag.active = false;

        if (!exists) tagList.push(tag);
      }
    }
    this.setState({ tagList });
  }
  render() {
    return (
      <Router>
        <div>
          <header id="main-header">
            <div className="left">
              <Link className="logo" to="/">
                <img src={Logo} alt="Classic Team Championship Logo" />
              </Link>
              <nav id="main-nav">
                <Link to="/posts">Posts</Link>
                <Link to="/account">Account</Link>
                <Link to="/about">About</Link>
              </nav>
            </div>
            <input className="search" type="text" placeholder="Search..." />
          </header>
          <Route
            path="/posts"
            exact
            render={() => (
              <PostList
                setPostList={this.setPostList}
                posts={this.state.postList}
                toggleTag={this.toggleTag}
                tags={this.state.tagList}
              />
            )}
          />
          <Route path="/post/:id" component={PostSingle} />
          <Route path="/account" component={Account} />
          <Route path="/about" exact component={About} />
          <Redirect from="/" to="/posts" />
        </div>
      </Router>
    );
  }
}

export default App;

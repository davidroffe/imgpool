import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link
} from 'react-router-dom';
import Header from './Header';
import Account from './Account/index';
import PostSearch from './Post/Search';
import PostList from './Post/List';
import PostSingle from './Post/Single';
import About from './About';

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
    let tagList = [];
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
          <Header>
            <PostSearch setPostList={this.setPostList} />
          </Header>
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
          <Switch>
            <Route path="/post/:id" component={PostSingle} />
            <Route path="/account" component={Account} />
            <Route path="/about" exact component={About} />
            <Redirect from="/" exact to="/posts" />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;

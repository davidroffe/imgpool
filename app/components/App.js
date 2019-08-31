import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import TagMenu from './TagMenu';
import Splash from './Splash';
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
      tagList: [],
      tagMenu: false
    };

    this.toggleTagMenu = this.toggleTagMenu.bind(this);
    this.setPostList = this.setPostList.bind(this);
    this.processTagList = this.processTagList.bind(this);
  }
  toggleTagMenu(e) {
    e.preventDefault();

    this.setState({
      tagMenu: !this.state.tagMenu
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

        if (!exists) tagList.push(tag);
      }
    }
    this.setState({ tagList });
  }
  render() {
    return (
      <Router>
        <div>
          <TagMenu
            isActive={this.state.tagMenu}
            toggleMenu={this.toggleTagMenu}
            tags={this.state.tagList}
          />
          <header id="main-header">
            <div className="left">
              <Link className="logo" to="/">
                <img src={Logo} alt="Classic Team Championship Logo" />
              </Link>
              <nav id="main-nav">
                <Link to="/post">Browse</Link>
                <Link to="/account">Account</Link>
                <Link to="/tags">Tags</Link>
                <Link to="/about">About</Link>
              </nav>
            </div>
            <input className="search" type="text" placeholder="Search..." />
          </header>
          <Route path="/" exact component={Splash} />
          <Route
            path="/post"
            exact
            render={() => (
              <PostList
                setPostList={this.setPostList}
                posts={this.state.postList}
              />
            )}
          />
          <Route path="/post/:id" component={PostSingle} />
          <Route path="/account" component={Account} />
          <Route path="/about" exact component={About} />
        </div>
      </Router>
    );
  }
}

export default App;

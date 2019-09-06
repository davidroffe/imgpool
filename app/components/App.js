import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Account from './Account/index';
import PostSearch from './Post/Search';
import PostList from './Post/List';
import PostSingle from './Post/Single';
import About from './About';

const App = () => {
  const [postList, setPostList] = useState([]);
  const [tagList, setTagList] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  const toggleTag = menuTag => {
    const newTagList = tagList.map(tag => {
      if (tag.id === menuTag.id) {
        tag.active = tag.active ? false : true;
      }
      return tag;
    });

    setTagList(newTagList);
  };

  const retrievePosts = () => {
    if (!postList.length) {
      axios.get('/api/post/list').then(res => {
        setPostList(res.data);
        processTagList(res.data);
      });
    }
  };

  const processTagList = postList => {
    let newTagList = [];
    let exists;

    for (var i = 0; i < postList.length; i++) {
      for (var j = 0; j < postList[i].tag.length; j++) {
        exists = false;
        let tag = postList[i].tag[j];

        for (var k = 0; k < newTagList.length; k++) {
          if (newTagList[k].id === tag.id) {
            exists = true;
          }
        }

        tag.active = false;

        if (!exists) newTagList.push(tag);
      }
    }

    setTagList(newTagList);
  };

  const handleSearchChange = e => {
    const newSearchValue = e.target.value.toLowerCase();

    setSearchValue(newSearchValue);
  };

  const handleSearch = (e, toPostList, newSearchValue = '') => {
    e.preventDefault();
    let searchQuery;

    if (newSearchValue) {
      setSearchValue(newSearchValue);
      searchQuery = newSearchValue;
    } else {
      searchQuery = searchValue;
    }

    const url = searchQuery.length ? '/api/post/search' : '/api/post/list';

    axios.get(url, { params: { searchQuery: searchQuery } }).then(res => {
      setPostList(res.data);
      toPostList();
    });
  };
  return (
    <Router>
      <div>
        <Header>
          <PostSearch
            handleSubmit={handleSearch}
            handleSearchChange={handleSearchChange}
            searchValue={searchValue}
          />
        </Header>
        <Route
          path="/posts"
          exact
          render={() => (
            <PostList
              retrievePosts={retrievePosts}
              posts={postList}
              toggleTag={toggleTag}
              tags={tagList}
            />
          )}
        />
        <Switch>
          <Route
            path="/post/:id"
            render={props => (
              <PostSingle
                {...props}
                handleTagClick={handleSearch}
                setSearchValue={setSearchValue}
              />
            )}
          />
          <Route path="/account" component={Account} />
          <Route path="/about" exact component={About} />
          <Redirect from="/" exact to="/posts" />
        </Switch>
      </div>
    </Router>
  );
};

export default App;

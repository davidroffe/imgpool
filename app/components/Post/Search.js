import React, { useState } from 'react';
import axios from 'axios';

const PostSearch = props => {
  const [searchValue, setSearchValue] = useState('');
  const handleSubmit = e => {
    e.preventDefault();
    const searchQuery = e.target.children[0].value;
    const url = searchQuery.length ? '/api/post/search' : '/api/post/list';
    axios.get(url, { params: { searchQuery: searchQuery } }).then(res => {
      props.setPostList(res.data);
    });
  };
  const handleChange = e => {
    setSearchValue(e.target.value);
  };
  return (
    <form className="search" onSubmit={handleSubmit}>
      <input
        className="search-field"
        type="text"
        placeholder="Search..."
        onChange={handleChange}
      />
    </form>
  );
};

export default PostSearch;

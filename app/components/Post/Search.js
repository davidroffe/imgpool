import React from 'react';
import { withRouter } from 'react-router-dom';

const PostSearch = props => {
  const handleChange = e => {
    props.setSearchValue(e.target.value);
  };
  const handleSubmit = e => {
    props.handleSubmit(e, () => props.history.push('/posts'));
  };
  return (
    <form className="search" onSubmit={handleSubmit}>
      <input
        className="search-field"
        type="text"
        placeholder="Search..."
        value={props.searchValue}
        onChange={handleChange}
      />
    </form>
  );
};

export default withRouter(PostSearch);

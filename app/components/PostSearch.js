import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setSearch, setPostsList } from '../actions';
import axios from 'axios';

const mapStateToProps = state => {
  return { text: state.search };
};

const PostSearch = props => {
  const handleSearch = e => {
    e.preventDefault();

    const searchQuery = props.text;

    const url = searchQuery.length ? '/api/post/search' : '/api/post/list';

    axios.get(url, { params: { searchQuery } }).then(res => {
      props.dispatch(setPostsList(res.data));
      props.history.push('/posts');
    });
  };
  const handleChange = e => {
    const newSearchValue = e.target.value.toLowerCase();

    props.dispatch(setSearch(newSearchValue));
  };
  return (
    <form className="search" onSubmit={handleSearch}>
      <input
        className="search-field"
        type="text"
        placeholder="Search..."
        value={props.text}
        onChange={handleChange}
      />
    </form>
  );
};

PostSearch.propTypes = {
  text: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
};

export default withRouter(connect(mapStateToProps)(PostSearch));

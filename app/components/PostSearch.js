import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { setSearch } from '../actions';

const mapStateToProps = state => {
  return { text: state.search };
};

export const PostSearch = props => {
  const handleSubmit = e => {
    props.handleSearch(e, props.history);
  };
  const handleChange = e => {
    const newSearchValue = e.target.value.toLowerCase();

    props.dispatch(setSearch(newSearchValue));
  };
  return (
    <form className="search" onSubmit={handleSubmit}>
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
  handleSearch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
};

export default withRouter(connect(mapStateToProps)(PostSearch));

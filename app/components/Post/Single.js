import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setPosts, setSearch } from '../../actions';
import axios from 'axios';

const Single = props => {
  const [post, setPost] = useState({
    id: props.match.params.id || '',
    tag: []
  });

  useEffect(() => {
    axios
      .get('/api/post/single', {
        params: { id: post.id }
      })
      .then(res => {
        setPost(res.data);
      });
  }, []);
  const handleTagClick = e => {
    const searchQuery = e.target.innerText;
    const url = '/api/post/search';

    props.dispatch(setSearch(searchQuery));
    axios.get(url, { params: { searchQuery: searchQuery } }).then(res => {
      props.dispatch(setPosts(res.data));
      props.processTags(res.data);
      props.history.push('/posts');
    });
  };
  return (
    <section id="post-single">
      <div className="image-container">
        <img src={post.url} />
      </div>
      <div className="tags">
        {post.tag.map((tag, index) => {
          return (
            <button key={index} className="tag" onClick={handleTagClick}>
              {tag.name}
            </button>
          );
        })}
      </div>
    </section>
  );
};

Single.propTypes = {
  dispatch: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  processTags: PropTypes.func.isRequired
};

export default connect(() => {
  return {};
})(Single);

import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import TagMenu from './TagMenu';

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

  const getTagsFromPosts = post => {
    return post.tag;
  };

  return (
    <section id="post-single">
      <TagMenu tags={getTagsFromPosts(post)} />
      <div className="image-container">
        <img src={post.url} />
      </div>
    </section>
  );
};

Single.propTypes = {
  dispatch: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default connect(() => {
  return {};
})(Single);

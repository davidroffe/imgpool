import React, { useState, useEffect } from 'react';
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
  });
  const handleTagClick = e => {
    props.handleTagClick(
      e,
      () => props.history.push('/posts'),
      e.target.innerText
    );
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

export default Single;

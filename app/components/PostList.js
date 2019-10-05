import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TagMenu from './TagMenu';

const mapStateToProps = state => {
  return {
    posts: state.posts,
    tags: state.tagMenu.tags
  };
};

const List = props => {
  useEffect(() => {
    props.retrievePosts();
  });

  if (props.posts[0] === false) {
    return (
      <section id="splash">
        <div id="splash-center">
          <h1>IMGPOOL</h1>
        </div>
      </section>
    );
  } else {
    return (
      <section id="post-list">
        <TagMenu />
        {props.posts.map((post, index) => {
          return (
            <Link key={index} to={'/post/' + post.id} className="post-item">
              <img src={post.thumbUrl} />
            </Link>
          );
        })}
      </section>
    );
  }
};

List.propTypes = {
  posts: PropTypes.array.isRequired,
  tags: PropTypes.array.isRequired
};

export default connect(mapStateToProps)(List);

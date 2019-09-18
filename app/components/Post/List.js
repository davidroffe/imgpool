import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TagMenu from '../TagMenu';

const mapStateToProps = state => {
  return {
    posts: state.posts,
    tags: state.tags
  };
};

const List = props => {
  useEffect(() => {
    props.retrievePosts();
  });

  const getActivePosts = () => {
    if (props.posts.length === 0 || props.tags.length === 0) {
      return props.posts;
    }

    const tags = props.tags;
    let posts = props.posts;
    let activePosts = [];
    let activeTags = [];
    let tagsActive;

    for (let i = 0; i < tags.length; i++) {
      if (tags[i].active) activeTags.push(tags[i]);
    }

    if (activeTags.length) {
      for (let i = 0; i < posts.length; i++) {
        tagsActive = 0;

        for (let j = 0; j < activeTags.length; j++) {
          for (let k = 0; k < posts[i].tag.length; k++) {
            if (activeTags[j].id === posts[i].tag[k].id) {
              tagsActive++;
            }
          }
        }
        if (tagsActive === activeTags.length) {
          activePosts.push(posts[i]);
        }
      }
    } else {
      activePosts = props.posts;
    }

    return activePosts;
  };
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
        {getActivePosts().map((post, index) => {
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

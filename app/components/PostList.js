import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import { setPosts } from '../actions';
import PropTypes from 'prop-types';
import TagMenu from './TagMenu';

const mapStateToProps = state => {
  return {
    posts: state.posts
  };
};

const List = props => {
  useEffect(() => {
    retrievePosts();
  });

  const retrievePosts = () => {
    if (!props.posts.length) {
      axios.get('/api/post/list').then(res => {
        props.dispatch(setPosts(res.data.length ? res.data : [false]));
      });
    }
  };

  const getTagsFromPosts = posts => {
    let newTags = [];
    let exists;

    for (var i = 0; i < posts.length; i++) {
      for (var j = 0; j < posts[i].tag.length; j++) {
        exists = false;
        let tag = posts[i].tag[j];

        for (var k = 0; k < newTags.length; k++) {
          if (newTags[k].id === tag.id) {
            exists = true;
          }
        }

        tag.active = false;

        if (!exists) newTags.push(tag);
      }
    }

    return newTags;
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
        <TagMenu tags={getTagsFromPosts(props.posts)} />
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
  posts: PropTypes.array.isRequired
};

export default connect(mapStateToProps)(List);

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
    if (!props.posts.list.length) {
      retrievePosts();
    }
  });

  const retrievePosts = () => {
    axios
      .get('/api/post/list', { params: { offset: props.posts.offset } })
      .then(res => {
        props.dispatch(
          setPosts(
            res.data.length
              ? { list: res.data, offset: props.posts.offset + res.data.length }
              : { list: [false], offset: props.posts.offset + res.data.length }
          )
        );
      });
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

  if (!props.posts.list.length) {
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
        <TagMenu tags={getTagsFromPosts(props.posts.list)} />
        {props.posts.list.map((post, index) => {
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
  dispatch: PropTypes.func.isRequired,
  posts: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(List);

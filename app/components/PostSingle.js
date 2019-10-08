import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { setUser } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import TagMenu from './TagMenu';

const mapStateToProps = state => {
  return {
    userFavories: state.user.favorites
  };
};

const Single = props => {
  const [post, setPost] = useState({
    id: props.match.params.id || '',
    tag: [],
    user: {
      id: '',
      username: ''
    }
  });
  const [optionsMenu, setOptionsMenu] = useState(false);

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

  const toggleFavorite = e => {
    e.preventDefault();

    axios({
      url: '/api/post/favorite',
      method: 'post',
      params: {
        postId: post.id
      }
    }).then(res => {
      props.dispatch(setUser('favorites', res.data.favorites));
    });
  };

  return (
    <section id="post-single">
      <TagMenu tags={getTagsFromPosts(post)} />
      <div className="image-container">
        <div className="inner">
          <div className="post-info">
            <button
              className="toggle-options"
              onClick={() => setOptionsMenu(!optionsMenu)}
            >
              options <span>+</span>
            </button>
            <div className={`options${optionsMenu ? ' active' : ''}`}>
              <button className="toggle-fav" onClick={toggleFavorite}>
                <span className="icon">&hearts;</span>
                <span className="text">add to favorites</span>
              </button>
              <button className="flag-post">
                <span className="icon flag">&#9873;</span>
                <span className="text">flag post</span>
              </button>
            </div>
            <p className="poster">
              posted by:{' '}
              <Link to={`/user/${post.user.id}`}>{post.user.username}</Link>
            </p>
          </div>
          <img src={post.url} />
        </div>
      </div>
    </section>
  );
};

Single.propTypes = {
  dispatch: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(Single);

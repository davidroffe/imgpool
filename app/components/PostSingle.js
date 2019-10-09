import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { setUser, setPosts } from '../actions';
import PropTypes from 'prop-types';
import axios from 'axios';
import TagMenu from './TagMenu';

const mapStateToProps = state => {
  return {
    userId: state.user.id,
    isAdmin: state.user.admin,
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

  const isFavorited = () => {
    for (let i = 0; i < props.userFavories.length; i++) {
      if (props.userFavories[i].id === post.id) return true;
    }
    return false;
  };

  const deletePost = e => {
    e.preventDefault();

    axios({
      url: `/api/post/delete/${post.id}`,
      method: 'post'
    }).then(() => {
      props.dispatch(setPosts([]));
      props.history.push('/posts');
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
            <ul className={`options${optionsMenu ? ' active' : ''}`}>
              <li>
                <button
                  className={`toggle-fav${isFavorited() ? ' favorited' : ''}`}
                  onClick={toggleFavorite}
                >
                  <span className="icon">&hearts;</span>
                  <span className="text add">add to favorites</span>
                  <span className="text remove">remove from favorites</span>
                </button>
              </li>
              <li>
                <button className="flag-post">
                  <span className="icon flag">&#9873;</span>
                  <span className="text">flag post</span>
                </button>
              </li>
              <li>
                {post.userId === props.userId || props.isAdmin ? (
                  <button className="delete-post" onClick={deletePost}>
                    <span className="icon x">×</span>
                    <span className="text">delete post</span>
                  </button>
                ) : null}
              </li>
            </ul>
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
  history: PropTypes.object.isRequired,
  userId: PropTypes.number.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  userFavories: PropTypes.array.isRequired
};

export default connect(mapStateToProps)(Single);

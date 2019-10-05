import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  toggleTagMenu,
  setPosts,
  setSearch,
  setMenuTagsFromPosts
} from '../actions';
import axios from 'axios';

const mapStateToProps = state => {
  return {
    tags: state.tagMenu.tags,
    tagMenu: state.tagMenu.state
  };
};

const TagMenu = props => {
  const toggleMenu = e => {
    e.preventDefault();

    props.dispatch(toggleTagMenu());
  };
  const handleClick = (tag, e) => {
    e.preventDefault();

    const searchQuery = e.target.innerText;
    const url = '/api/post/search';

    props.dispatch(setSearch(searchQuery));
    axios.get(url, { params: { searchQuery: searchQuery } }).then(res => {
      props.dispatch(setPosts(res.data));
      props.dispatch(setMenuTagsFromPosts(res.data));
      props.history.push('/posts');
      props.dispatch(toggleTagMenu());
    });
  };

  return (
    <aside id="tag-menu" className={props.tagMenu ? 'active' : ''}>
      <div className="body">
        <nav>
          {props.tags.map((tag, index) => {
            return (
              <Link
                key={index}
                to={'post?tag=' + tag.id}
                className={'tag ' + tag.active}
                onClick={handleClick.bind(this, tag)}
                active={tag.active ? '' : null}
              >
                {tag.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <button className="tab" onClick={toggleMenu}>
        <span className="burger">
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
        </span>
        <span className="text">View Tags</span>
      </button>
    </aside>
  );
};

TagMenu.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  tagMenu: PropTypes.bool.isRequired,
  tags: PropTypes.array.isRequired
};

export default withRouter(connect(mapStateToProps)(TagMenu));

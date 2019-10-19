import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setPostsList, setSearch } from '../actions';
import axios from 'axios';

const TagMenu = props => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = e => {
    e.preventDefault();

    setShowMenu(!showMenu);
  };
  const handleClick = (tag, e) => {
    e.preventDefault();

    const searchQuery = e.target.innerText;
    const url = '/api/post/search';

    props.dispatch(setSearch(searchQuery));
    axios.get(url, { params: { searchQuery: searchQuery } }).then(res => {
      props.dispatch(setPostsList(res.data));
      setShowMenu(!showMenu);
      props.history.push('/posts');
    });
  };

  return (
    <aside id="tag-menu" className={showMenu ? 'active' : ''}>
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
  tags: PropTypes.array.isRequired
};

export default withRouter(
  connect(() => {
    return {};
  })(TagMenu)
);

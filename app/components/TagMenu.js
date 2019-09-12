import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleTagMenu, toggleTag } from '../actions';

const mapStateToProps = state => {
  return {
    tags: state.tags,
    tagMenu: state.tagMenu
  };
};

const TagMenu = props => {
  const toggleMenu = e => {
    e.preventDefault();

    props.dispatch(toggleTagMenu());
  };
  const handleClick = (tag, e) => {
    e.preventDefault();
    e.target.toggleAttribute('active');

    props.dispatch(toggleTag(tag));
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
  tagMenu: PropTypes.bool.isRequired,
  tags: PropTypes.array.isRequired
};

export default connect(mapStateToProps)(TagMenu);

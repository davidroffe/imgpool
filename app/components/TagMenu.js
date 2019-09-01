import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const TagMenu = props => {
  const handleClick = (tag, e) => {
    e.preventDefault();
    e.target.toggleAttribute('active');

    props.toggleTag(tag);
  };

  return (
    <aside id="tag-menu" className={props.isActive ? 'active' : ''}>
      <div className="body">
        <nav>
          {props.tags.map((tag, index) => {
            return (
              <Link
                key={index}
                to={'post?tag=' + tag.id}
                className={'tag ' + tag.active}
                onClick={handleClick.bind(this, tag)}
              >
                {tag.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <button className="tab" onClick={props.toggleMenu}>
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

export default TagMenu;

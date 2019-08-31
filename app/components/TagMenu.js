import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const TagMenu = props => {
  const handleClick = e => {
    e.preventDefault();
    e.target.nextSibling.click();
  };
  const handleChange = e => {
    const fileName = e.target.value.replace(/^.*?([^\\\/]*)$/, '$1');

    if (fileName) {
      setPlaceholder(fileName);
    } else {
      setPlaceholder(props.placeholder || 'CHOOSE FILE');
    }

    props.handleChange(e);
  };

  return (
    <aside id="tag-menu" className={props.isActive ? 'active' : ''}>
      <div className="body">
        <nav>
          {props.tags.map((tag, index) => {
            return (
              <Link key={index} to={'post?tag=' + tag.id} className="tag">
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

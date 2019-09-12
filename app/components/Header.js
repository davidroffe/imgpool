import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Logo from '../assets/images/logo.svg';

const Header = props => {
  return (
    <header id="main-header">
      <div className="left">
        <Link className="logo" to="/">
          <img src={Logo} alt="Classic Team Championship Logo" />
        </Link>
        <nav id="main-nav">
          <Link to="/posts">Posts</Link>
          <Link to="/account">Account</Link>
          <Link to="/about">About</Link>
        </nav>
      </div>
      {props.children}
    </header>
  );
};

Header.propTypes = {
  children: PropTypes.element.isRequired
};

export default Header;

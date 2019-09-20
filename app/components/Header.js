import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Logo from '../assets/images/logo.svg';

const mapStateToProps = state => {
  return {
    loggedIn: state.user.loggedIn,
    admin: state.user.admin
  };
};

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
          {props.loggedIn && props.admin ? (
            <Link to="/admin">Admin</Link>
          ) : null}
        </nav>
      </div>
      {props.children}
    </header>
  );
};

Header.propTypes = {
  children: PropTypes.element.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  admin: PropTypes.bool.isRequired
};

export default connect(mapStateToProps)(Header);

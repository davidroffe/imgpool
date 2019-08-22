import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Splash from './Splash';
import Account from './Account/index';
import About from './About';
import Logo from '../assets/images/logo.svg';
class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <header id="main-header">
            <div className="left">
              <Link className="logo" to="/">
                <img src={Logo} alt="Classic Team Championship Logo" />
              </Link>
              <nav id="main-nav">
                <Link to="/browse">Browse</Link>
                <Link to="/account">Account</Link>
                <Link to="/tags">Tags</Link>
                <Link to="/about">About</Link>
              </nav>
            </div>
            <input className="search" type="text" placeholder="Search..." />
          </header>
          <Route path="/" exact component={Splash} />
          <Route path="/account" component={Account} />
          <Route path="/about" exact component={About} />
        </div>
      </Router>
    );
  }
}

export default App;

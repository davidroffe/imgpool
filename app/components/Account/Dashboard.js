import React from 'react';

class Login extends React.Component {
  render() {
    // TODO: Account dashboard
    //Username on top with logout button to the right
    //Simple text links to change account info or upload images
    return (
      <section id="account-dashboard">
        <h1>
          <span>Account</span>
        </h1>
        <h2>Username</h2>
        <div className="row">
          <p>{this.props.username}</p>
          <button>edit</button>
        </div>
        <h2>Email</h2>
        <div className="row">
          <p>{this.props.email}</p>
          <button>edit</button>
        </div>
        <h2>Password</h2>
        <div className="row">
          <p>hidden</p>
          <button>edit</button>
        </div>
        <button id="delete-account">Delete Account</button>
      </section>
    );
  }
}

export default Login;

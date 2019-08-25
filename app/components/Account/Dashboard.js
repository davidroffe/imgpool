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
        <div className="left">
          <h2>Username</h2>
          <div className="row">
            <p>{this.props.username}</p>
            <button
              id="edit-username"
              onClick={this.props.toggleModal.bind(this, 'edit')}
            >
              edit
            </button>
          </div>
          <h2>Email</h2>
          <div className="row">
            <p>{this.props.email}</p>
            <button
              id="edit-email"
              onClick={this.props.toggleModal.bind(this, 'edit')}
            >
              edit
            </button>
          </div>
          <h2>Password</h2>
          <div className="row">
            <p>hidden</p>
            <button
              id="edit-password"
              onClick={this.props.toggleModal.bind(this, 'edit')}
            >
              edit
            </button>
          </div>
          <button className="button-large" id="delete-account">
            Delete Account
          </button>
        </div>
        <div className="right">
          <button
            className="border-button"
            id="create-post"
            onClick={this.props.toggleModal.bind(this, 'createPost')}
          >
            Create Post
          </button>
        </div>
      </section>
    );
  }
}

export default Login;

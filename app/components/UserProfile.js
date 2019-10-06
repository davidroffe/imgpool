import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const UserProfile = props => {
  const [user, setUser] = useState({
    username: '',
    joinDate: '',
    favorites: '',
    bio: '',
    errorMessage: []
  });
  useEffect(() => {
    axios.get(`/api/user/get/${props.match.params.id}`).then(res => {
      console.log(res.data);

      if (res.data.valid) {
        setUser({
          ...res.data,
          joinDate: new Date(res.data.joinDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        });
      } else if (!props.loggedIn) {
        props.history.push('/');
      }
    });
  }, []);

  return (
    <section id="account-dashboard">
      <h1>
        <span>User</span>
      </h1>
      <div className="left">
        <h2>Username</h2>
        <div className="row">
          <p>{user.username}</p>
        </div>
        <h2>Join Date</h2>
        <div className="row">
          <p>{user.joinDate}</p>
        </div>
        {/* <h2>Favorites</h2>
        <div className="row">
          <p>{user.favorites}</p>
          <button>view</button>
        </div> */}
        <h2>Bio</h2>
        <div className="row">
          <p>{user.bio}</p>
        </div>
      </div>
      <div className="right">
        {/* <button className="border-button" id="logout">
          Send Message
        </button> */}
      </div>
      {/* <SendMessage /> */}
    </section>
  );
};

UserProfile.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default UserProfile;

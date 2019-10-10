import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { hideNotification } from '../../actions';

const mapStateToProps = state => {
  return {
    message: state.notification.message,
    show: state.notification.show
  };
};

const Notification = props => {
  const toggleNotification = e => {
    e.preventDefault();
    props.dispatch(hideNotification());
  };
  return props.show ? (
    <div id="notification-container">
      {Array.isArray(props.message) ? (
        props.message.map((message, index) => {
          return (
            <p key={index} id="notification" onClick={toggleNotification}>
              {message}
            </p>
          );
        })
      ) : (
        <p className="notification" onClick={toggleNotification}>
          {props.message}
        </p>
      )}
    </div>
  ) : null;
};

Notification.propTypes = {
  dispatch: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired
};

export default connect(mapStateToProps)(Notification);

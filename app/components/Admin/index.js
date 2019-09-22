import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setTags } from '../../actions';
import axios from 'axios';
import Dashboard from './Dashboard';
import Modal from '../Utility/Modal';

const mapStateToProps = state => {
  return {
    loggedIn: state.user.loggedIn,
    admin: state.user.admin,
    tags: state.tags
  };
};

const Admin = props => {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [errorMessage, setErrorMessage] = useState([]);

  useEffect(() => {
    if (!props.loggedIn || !props.admin) {
      props.history.push('/account');
    }
  });

  const retrieveTags = () => {
    if (!props.tags.length) {
      axios.get('/api/tags/get').then(res => {
        props.dispatch(setTags(res.data.length ? res.data : [false]));
      });
    }
  };

  const toggleSignup = e => {
    e.preventDefault();
  };

  const toggleModal = (modalContent, e) => {
    e = typeof e === 'undefined' ? modalContent : e;

    if (e.target.id === 'modal-container') {
      setShowModal(false);
    } else if (typeof modalContent === 'string') {
      setModalContent(modalContent);
      setShowModal(true);
    }

    setErrorMessage([]);
  };
  return (
    <section id="account">
      <Dashboard
        retrieveTags={retrieveTags}
        toggleSignup={toggleSignup}
        toggleModal={toggleModal}
      />
      {showModal ? <Modal toggleModal={toggleModal}></Modal> : null}
    </section>
  );
};

Admin.propTypes = {
  dispatch: PropTypes.func.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  admin: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  tags: PropTypes.array.isRequired
};

export default connect(mapStateToProps)(Admin);

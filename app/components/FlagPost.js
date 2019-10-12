import React from 'react';
import PropTypes from 'prop-types';
import Input from './Utility/Input';
import Modal from './Utility/Modal';

const FlagPost = props => {
  return (
    <Modal show={props.data.show} toggleModal={props.clearValues}>
      <form
        id="flag-post-form"
        className="form-light"
        onSubmit={props.handleSubmit}
      >
        <div className="field-container">
          <textarea
            id="reason"
            title="reason"
            name="reason"
            value={props.data.reason}
            placeholder={'REASON FOR FLAGGING POST...'}
            onChange={props.handleChange}
          />
        </div>
        <Input className="border-button" type="submit" />
      </form>
    </Modal>
  );
};

FlagPost.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  clearValues: PropTypes.func.isRequired,
  data: PropTypes.shape({
    show: PropTypes.bool.isRequired,
    reason: PropTypes.string.isRequired
  })
};

export default FlagPost;

import React, { useState } from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import Modal from '../Utility/Modal';

const TagForm = props => {
  const [selectedTags, setSelectedTags] = useState([]);

  const handleChange = selectedTags => {
    setSelectedTags(selectedTags);
  };

  const handleSubmit = e => {
    e.preventDefault();
    const tagIds = selectedTags.map(tag => {
      return tag.id;
    });
    const url =
      e.target.id === 'toggle-state' ? '/api/tag/toggle' : 'api/tag/delete';

    props.handleSubmit(url, tagIds);
    setSelectedTags([]);
  };

  return props.show ? (
    <Modal
      showModal={props.show}
      toggleModal={() => props.toggleShow(!props.show)}
    >
      <form id="admin-manage-form" className="form-light">
        <Select
          id="admin-manage-select"
          classNamePrefix="admin-manage-select"
          isMulti
          closeMenuOnSelect={false}
          options={props.tags.map(tag => {
            return {
              value: tag.name,
              label: `${tag.name} ${tag.active ? '' : '(Disabled)'}`,
              id: tag.id
            };
          })}
          onChange={handleChange}
        />
        <div className="error-messages">
          {props.errorMessage.map((errorMessage, index) => {
            return (
              <p key={index} className="error">
                {errorMessage}
              </p>
            );
          })}
        </div>
        <button
          id="toggle-state"
          className="border-button"
          onClick={handleSubmit}
        >
          Toggle State
        </button>
        <button
          id="delete"
          className="border-button-red"
          onClick={handleSubmit}
        >
          Delete
        </button>
      </form>
    </Modal>
  ) : null;
};

TagForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  tags: PropTypes.array.isRequired,
  show: PropTypes.bool.isRequired,
  toggleShow: PropTypes.func.isRequired,
  errorMessage: PropTypes.array.isRequired
};

export default TagForm;

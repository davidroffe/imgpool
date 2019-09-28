import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import Modal from '../Utility/Modal';

const TagForm = props => {
  const handleChange = selectedTags => {
    console.log(selectedTags);
  };

  const handleSubmit = e => {
    e.preventDefault();
  };

  return props.show ? (
    <Modal
      showModal={props.show}
      toggleModal={() => props.toggleShow(!props.show)}
    >
      <form id="tag-form" className="form-light" onSubmit={handleSubmit}>
        <Select
          id="tag-select"
          classNamePrefix="tag-select"
          isMulti
          closeMenuOnSelect={false}
          options={props.tags.map(tag => {
            return { value: tag.name, label: tag.name };
          })}
          onChange={handleChange}
        />
        <button className="border-button">Black List</button>
        <button className="border-button-red">Delete</button>
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

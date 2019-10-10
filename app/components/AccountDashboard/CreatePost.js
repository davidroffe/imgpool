import React from 'react';
import PropTypes from 'prop-types';
import Input from '../Utility/Input';
import FileInput from '../Utility/FileInput';
import Modal from '../Utility/Modal';

const CreatePost = props => {
  return (
    <Modal show={props.data.show} toggleModal={props.clearValues}>
      <form id="post-form" className="form-light" onSubmit={props.handleSubmit}>
        <div className="field-container">
          <FileInput
            id="file"
            title={'Post'}
            name={'post'}
            value={props.data.file.name}
            handleChange={props.handleChange.bind(null, 'createPost', 'file')}
          />
          <Input
            id="source"
            autoComplete={'off'}
            type={'text'}
            title={'Source'}
            name={'source'}
            value={props.data.source}
            placeholder={'SOURCE URL'}
            handleChange={props.handleChange.bind(null, 'createPost', 'source')}
          />
          <Input
            id="tags"
            autoComplete={'off'}
            type={'text'}
            title={'Tags'}
            name={'tags'}
            value={props.data.tags}
            placeholder={'TAGS'}
            handleChange={props.handleChange.bind(null, 'createPost', 'tags')}
          />
        </div>
        <Input className="border-button" type="submit" />
      </form>
    </Modal>
  );
};

CreatePost.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  clearValues: PropTypes.func.isRequired,
  data: PropTypes.shape({
    show: PropTypes.bool.isRequired,
    file: PropTypes.shape({
      value: PropTypes.object.isRequired,
      name: PropTypes.string.isRequired
    }),
    source: PropTypes.string.isRequired,
    tags: PropTypes.string.isRequired
  })
};

export default CreatePost;

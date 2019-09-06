import React from 'react';
import Input from '../Utility/Input';
import FileInput from '../Utility/FileInput';

const CreatePost = props => {
  return (
    <form id="post-form" className="form-light" onSubmit={props.handleSubmit}>
      <FileInput
        id="file"
        type={'file'}
        title={'Post'}
        name={'post'}
        value={props.post}
        handleChange={e => props.setPostFile(e.target.files[0])}
      />
      <Input
        id="source"
        autoComplete={'off'}
        type={'text'}
        title={'Source'}
        name={'source'}
        value={props.source}
        placeholder={'SOURCE URL'}
        handleChange={e => props.setPostSource(e.target.value)}
      />
      <Input
        id="tags"
        autoComplete={'off'}
        type={'text'}
        title={'Tags'}
        name={'tags'}
        value={props.tags}
        placeholder={'TAGS'}
        handleChange={e => props.setPostTags(e.target.value)}
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
      <Input className="border-button" type={'submit'} />
    </form>
  );
};

export default CreatePost;

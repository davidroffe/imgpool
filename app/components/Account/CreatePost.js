import React from 'react';
import Input from '../Utility/Input';
import FileInput from '../Utility/FileInput';

class CreatePost extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = props.handleChange;
    this.handleSubmit = props.handleSubmit;
  }
  render() {
    return (
      <form id="edit-form" className="form-light" onSubmit={this.handleSubmit}>
        <FileInput
          id="post"
          type={'file'}
          title={'Post'}
          name={'post'}
          value={this.props.post}
          handleChange={this.handleChange}
        />
        <Input
          id="source"
          autoComplete={'off'}
          type={'text'}
          title={'Source'}
          name={'source'}
          value={this.props.source}
          placeholder={'SOURCE'}
          handleChange={this.handleChange}
        />
        <Input
          id="tags"
          autoComplete={'off'}
          type={'text'}
          title={'Tags'}
          name={'tags'}
          value={this.props.tags}
          placeholder={'TAGS'}
          handleChange={this.handleChange}
        />
        {this.props.errorMessage.map((errorMessage, index) => {
          return (
            <p key={index} className="error">
              {errorMessage}
            </p>
          );
        })}
        <Input className="border-button" type={'submit'} />
      </form>
    );
  }
}

export default CreatePost;

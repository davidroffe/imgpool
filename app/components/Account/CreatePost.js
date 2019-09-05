import React from 'react';
import Input from '../Utility/Input';
import FileInput from '../Utility/FileInput';

class CreatePost extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <form
        id="post-form"
        className="form-light"
        onSubmit={this.props.handleSubmit}
      >
        <FileInput
          id="file"
          type={'file'}
          title={'Post'}
          name={'post'}
          value={this.props.post}
          handleChange={this.props.handleChange.bind(this, 'post')}
        />
        <Input
          id="source"
          autoComplete={'off'}
          type={'text'}
          title={'Source'}
          name={'source'}
          value={this.props.source}
          placeholder={'SOURCE URL'}
          handleChange={this.props.handleChange.bind(this, 'post')}
        />
        <Input
          id="tags"
          autoComplete={'off'}
          type={'text'}
          title={'Tags'}
          name={'tags'}
          value={this.props.tags}
          placeholder={'TAGS'}
          handleChange={this.props.handleChange.bind(this, 'post')}
        />
        <div className="error-messages">
          {this.props.errorMessage.map((errorMessage, index) => {
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
  }
}

export default CreatePost;

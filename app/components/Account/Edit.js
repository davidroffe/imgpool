import React from 'react';
import Input from '../Utility/Input';

class Edit extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = props.handleChange;
    this.handleSubmit = props.handleSubmit;
  }
  render() {
    return (
      <form id="edit-form" className="form-light" onSubmit={this.handleSubmit}>
        {this.props.field === 'edit-username' ? (
          <Input
            id="username"
            autoComplete={'off'}
            type={'text'}
            title={'Username'}
            name={'username'}
            value={this.props.username}
            placeholder={'USERNAME'}
            handleChange={this.handleChange}
          />
        ) : null}
        {this.props.field === 'edit-email' ? (
          <Input
            id="email"
            autoComplete={'off'}
            type={'text'}
            title={'Full Name'}
            name={'email'}
            value={this.props.email}
            placeholder={'EMAIL'}
            handleChange={this.handleChange}
          />
        ) : null}
        {this.props.field === 'edit-password' ? (
          <div>
            <Input
              id="password"
              autoComplete={'off'}
              type={'password'}
              title={'Password'}
              name={'password'}
              value={this.props.password}
              placeholder={'PASSWORD'}
              handleChange={this.handleChange}
            />
            <Input
              id="passwordConfirm"
              autoComplete={'off'}
              type={'password'}
              title={'password-confirm'}
              name={'password-confirm'}
              value={this.props.passwordConfirm}
              placeholder={'CONFIRM PASSWORD'}
              handleChange={this.handleChange}
            />
          </div>
        ) : null}
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

export default Edit;

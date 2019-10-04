import React from 'react';
import PropTypes from 'prop-types';
import Input from '../Utility/Input';
import Modal from '../Utility/Modal';

const DeleteAccount = props => {
  const handleChange = field => {
    console.log(field);
  };
  return (
    <Modal show={props.data.show} toggleModal={props.clearValues}>
      <form
        id="delete-account-form"
        className="form-light"
        onSubmit={props.handleSubmit}
      >
        <div>
          <Input
            id="password"
            autoComplete={'off'}
            type={'password'}
            title={'Password'}
            name={'password'}
            value={props.data.password}
            placeholder={'PASSWORD'}
            handleChange={props.handleChange.bind(
              null,
              'deleteAccount',
              'password'
            )}
          />
          <Input
            id="passwordConfirm"
            autoComplete={'off'}
            type={'password'}
            title={'password-confirm'}
            name={'password-confirm'}
            value={props.data.passwordConfirm}
            placeholder={'CONFIRM PASSWORD'}
            handleChange={props.handleChange.bind(
              null,
              'deleteAccount',
              'passwordConfirm'
            )}
          />
        </div>
        <div className="error-messages">
          {props.data.errorMessage.map((errorMessage, index) => {
            return (
              <p key={index} className="error">
                {errorMessage}
              </p>
            );
          })}
        </div>
        <Input className="border-button" type="submit" />
      </form>
    </Modal>
  );
};

DeleteAccount.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  clearValues: PropTypes.func.isRequired,
  data: PropTypes.shape({
    show: PropTypes.bool.isRequired,
    password: PropTypes.string.isRequired,
    passwordConfirm: PropTypes.string.isRequired,
    errorMessage: PropTypes.array.isRequired
  })
};

export default DeleteAccount;

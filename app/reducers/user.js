const initialState = {
  email: '',
  username: '',
  password: '',
  passwordConfirm: ''
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_EMAIL':
      return { ...state, email: action.text };
    case 'SET_USERNAME':
      return { ...state, username: action.text };
    case 'SET_PASSWORD':
      return { ...state, password: action.text };
    case 'SET_PASSWORDCONFIRM':
      return { ...state, passwordConfirm: action.text };
    case 'SET_LOGGEDIN':
      return { ...state, loggedIn: action.text };
    default:
      return state;
  }
};

export default user;

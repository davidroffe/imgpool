const initialState = {
  email: '',
  username: '',
  bio: '',
  password: '',
  passwordConfirm: '',
  loggedIn: false,
  admin: false,
  init: false
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_EMAIL':
      return { ...state, email: action.text };
    case 'SET_USERNAME':
      return { ...state, username: action.text };
    case 'SET_BIO':
      return { ...state, bio: action.text };
    case 'SET_PASSWORD':
      return { ...state, password: action.text };
    case 'SET_PASSWORDCONFIRM':
      return { ...state, passwordConfirm: action.text };
    case 'SET_LOGGEDIN':
      return { ...state, loggedIn: action.text };
    case 'SET_ADMIN':
      return { ...state, admin: action.text };
    case 'SET_INIT':
      return { ...state, init: true };
    default:
      return state;
  }
};

export default user;

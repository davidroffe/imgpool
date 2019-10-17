const initialState = {
  id: 0,
  email: '',
  username: '',
  bio: '',
  password: '',
  passwordConfirm: '',
  loggedIn: false,
  admin: false,
  init: false,
  favorites: []
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ID':
      return { ...state, id: action.value };
    case 'SET_EMAIL':
      return { ...state, email: action.value };
    case 'SET_USERNAME':
      return { ...state, username: action.value };
    case 'SET_BIO':
      return { ...state, bio: action.value };
    case 'SET_PASSWORD':
      return { ...state, password: action.value };
    case 'SET_PASSWORDCONFIRM':
      return { ...state, passwordConfirm: action.value };
    case 'SET_LOGGEDIN':
      return { ...state, loggedIn: action.value };
    case 'SET_ADMIN':
      return { ...state, admin: action.value };
    case 'CLEAR_USER':
      return { ...initialState, init: true };
    case 'SET_INIT':
      return { ...state, init: true };
    case 'SET_FAVORITES':
      return { ...state, favorites: action.value };
    default:
      return state;
  }
};

export default user;

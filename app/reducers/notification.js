const notification = (state = { message: '', show: false }, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION_MESSAGE':
      return { ...state, message: action.text };
    case 'HIDE_NOTIFICATION':
      return { ...state, show: false };
    case 'SHOW_NOTIFICATION':
      return { ...state, show: true };
    default:
      return state;
  }
};

export default notification;

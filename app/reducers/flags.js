const initialState = {
  id: 0,
  postId: 0,
  date: '',
  user: { id: 0, username: '' },
  active: true,
  reason: ''
};
const flags = (state = [initialState], action) => {
  switch (action.type) {
    case 'SET_FLAGS':
      return action.flags;
    default:
      return state;
  }
};

export default flags;

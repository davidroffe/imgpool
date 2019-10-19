const posts = (state = { list: [], offset: 0 }, action) => {
  switch (action.type) {
    case 'SET_POSTS':
      return action.posts;
    case 'SET_POSTS_LIST':
      return { ...state, list: action.posts };
    default:
      return state;
  }
};

export default posts;

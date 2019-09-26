const flags = (state = [], action) => {
  switch (action.type) {
    case 'SET_FLAGS':
      return action.flags;
    default:
      return state;
  }
};

export default flags;

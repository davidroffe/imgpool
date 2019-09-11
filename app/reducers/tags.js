const tags = (state = [], action) => {
  switch (action.type) {
    case 'SET_TAGS':
      return action.tags;
    case 'TOGGLE_TAG':
      return state.map(tag => {
        if (tag.id === action.id) {
          tag.active = tag.active ? false : true;
        }
        return tag;
      });
    default:
      return state;
  }
};

export default tags;

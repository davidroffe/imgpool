const initialState = {
  tags: [],
  state: false
};

const tagMenu = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_MENU_TAGS':
      return { ...state, tags: action.tags };
    case 'TOGGLE_TAG':
      var newTags = state.tags.map(tag => {
        if (tag.id === action.id) {
          tag.active = tag.active ? false : true;
        }
        return tag;
      });
      return { ...state, tags: newTags };
    case 'TOGGLE_TAG_MENU':
      var newMenuState = !state.state;
      return { ...state, state: newMenuState };
    default:
      return state;
  }
};

export default tagMenu;

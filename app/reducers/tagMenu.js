const initialState = {
  tags: [],
  state: false
};

const tagMenu = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_MENU_TAGS':
      return { ...state, tags: action.tags };
    case 'TOGGLE_TAG_MENU':
      var newMenuState = !state.state;
      return { ...state, state: newMenuState };
    default:
      return state;
  }
};

export default tagMenu;

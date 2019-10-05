const initialState = {
  tags: [],
  state: false
};

const tagMenu = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_MENU_TAGS':
      return { ...state, tags: action.tags };
    default:
      return state;
  }
};

export default tagMenu;

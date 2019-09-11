const tagMenu = (state = false, action) => {
  switch (action.type) {
    case 'TOGGLE_TAG_MENU':
      return !state;
    default:
      return state;
  }
};

export default tagMenu;

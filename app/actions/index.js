export const setPosts = posts => ({
  type: 'SET_POSTS',
  posts
});

export const setMenuTags = tags => ({
  type: 'SET_MENU_TAGS',
  tags
});

export const setTags = tags => ({
  type: 'SET_TAGS',
  tags
});

export const toggleTagMenu = () => ({
  type: 'TOGGLE_TAG_MENU'
});

export const toggleTag = tag => ({
  type: 'TOGGLE_TAG',
  id: tag.id
});

export const setSearch = text => ({
  type: 'SET_SEARCH',
  text
});

export const setUser = (field, value) => ({
  type: `SET_${field.toUpperCase()}`,
  text: value
});

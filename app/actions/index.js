export const setPosts = posts => ({
  type: 'SET_POSTS',
  posts
});

export const setMenuTags = tags => ({
  type: 'SET_MENU_TAGS',
  tags
});

export const setMenuTagsFromPosts = posts => {
  let newTags = [];
  let exists;

  for (var i = 0; i < posts.length; i++) {
    for (var j = 0; j < posts[i].tag.length; j++) {
      exists = false;
      let tag = posts[i].tag[j];

      for (var k = 0; k < newTags.length; k++) {
        if (newTags[k].id === tag.id) {
          exists = true;
        }
      }

      tag.active = false;

      if (!exists) newTags.push(tag);
    }
  }

  return {
    type: 'SET_MENU_TAGS',
    tags: newTags
  };
};

export const setTags = tags => ({
  type: 'SET_TAGS',
  tags
});

export const setUsers = users => ({
  type: 'SET_USERS',
  users
});

export const setFlags = flags => ({
  type: 'SET_FLAGS',
  flags
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

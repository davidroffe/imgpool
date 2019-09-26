import { combineReducers } from 'redux';
import posts from './posts';
import tags from './tags';
import tagMenu from './tagMenu';
import search from './search';
import user from './user';
import users from './users';
import flags from './flags';

export default combineReducers({
  posts,
  tags,
  tagMenu,
  search,
  user,
  users,
  flags
});

import { combineReducers } from 'redux';
import posts from './posts';
import tags from './tags';
import tagMenu from './tagMenu';
import search from './search';

export default combineReducers({
  posts,
  tags,
  tagMenu,
  search
});

import { combineReducers } from 'redux';
import nav from './Navigator';
import user from './User';

import devToolsEnhancer from 'remote-redux-devtools';

const AppReducer = combineReducers({
  nav,
  user
}, devToolsEnhancer());

export default AppReducer;

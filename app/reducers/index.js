import { combineReducers } from 'redux';
import { GuestHomeNavigator } from '../navigators/GuestSection/HomeNavigator';
import guestTabBar from './NavReducer';
import user from './User';

import devToolsEnhancer from 'remote-redux-devtools';

const AppReducer = combineReducers({
  // /nav: (state, action) => AppNavigator.router.getStateForAction(action, state),
  guestTabBar: guestTabBar,
  guestHomeNav: (state,action) => GuestHomeNavigator.router.getStateForAction(action,state),
  user
}, devToolsEnhancer());

export default AppReducer;

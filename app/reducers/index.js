import { combineReducers } from 'redux';
import { GuestHomeNavigator } from '../navigators/guest-section/HomeNavigator';
import { GuestViewingsNavigator } from '../navigators/guest-section/ViewingsNavigator';
import { GuestTabBarNavigator } from '../navigators/guest-section/GuestTabBarNavigator';


import guestTabBar from './NavReducer';
import {guestHomeNav} from './NavReducer';
import {guestViewingsNav} from './NavReducer';

import user from './User';

import devToolsEnhancer from 'remote-redux-devtools';

const AppReducer = combineReducers({
  // /nav: (state, action) => AppNavigator.router.getStateForAction(action, state),
  guestTabBar: (state,action) => GuestTabBarNavigator.router.getStateForAction(action,state),
  guestHomeNav: (state,action) => GuestHomeNavigator.router.getStateForAction(action,state),
  guestViewingsNav: (state,action) => GuestViewingsNavigator.router.getStateForAction(action,state),
  user
}, devToolsEnhancer());

export default AppReducer;

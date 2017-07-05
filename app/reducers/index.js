import { combineReducers } from 'redux';
import { GuestTabBarNavigator } from '../navigators/guest-section/GuestTabBarNavigator';
import { GuestHomeNavigator } from '../navigators/guest-section/HomeNavigator';
import { GuestViewingsNavigator } from '../navigators/guest-section/ViewingsNavigator';
import { LandlordTabBarNavigator } from '../navigators/landlord-section/LandlordTabBarNavigator';
import { LandlordHomeNavigator } from '../navigators/landlord-section/HomeNavigator';

import user from './User';
import section from './Section';
import webrtc from './NewWebRTC';

import devToolsEnhancer from 'remote-redux-devtools';

const AppReducer = combineReducers({
  //Guest Navigators
  // /nav: (state, action) => AppNavigator.router.getStateForAction(action, state),
  guestTabBar: (state,action) => GuestTabBarNavigator.router.getStateForAction(action,state),
  guestHomeNav: (state,action) => GuestHomeNavigator.router.getStateForAction(action,state),
  guestViewingsNav: (state,action) => GuestViewingsNavigator.router.getStateForAction(action,state),

  //Landlord Navigators
  landlordTabBar: (state,action) => LandlordTabBarNavigator.router.getStateForAction(action,state),
  landlordHomeNav: (state,action) => LandlordHomeNavigator.router.getStateForAction(action,state),


  user,
  section,
  webrtc
}, devToolsEnhancer());

export default AppReducer;

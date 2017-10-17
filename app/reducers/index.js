import { combineReducers } from 'redux';
import { GuestTabBarNavigator } from '../navigators/guest-section/GuestTabBarNavigator';
import { GuestHomeNavigator } from '../navigators/guest-section/HomeNavigator';
import { GuestPropertiesNavigator } from '../components/templates/guest-section/properties-tab/Navigator';
import { GuestFavouritesNavigator } from '../components/templates/guest-section/favourites-tab/Navigator';
import { LandlordTabBarNavigator } from '../navigators/landlord-section/LandlordTabBarNavigator';
import { LandlordHomeNavigator } from '../navigators/landlord-section/HomeNavigator';

import user from './User';
import section from './Section';
import webrtc from './NewWebRTC';
import chat from './Chat';
import properties from './Properties';
import propertyScreen from './PropertyScreen';

import devToolsEnhancer from 'remote-redux-devtools';

const AppReducer = combineReducers({
  //Guest Navigators
  guestTabBar: (state,action) => GuestTabBarNavigator.router.getStateForAction(action,state),
  guestHomeNav: (state,action) => GuestHomeNavigator.router.getStateForAction(action,state),
  guestPropertiesNav: (state,action) => GuestPropertiesNavigator.router.getStateForAction(action,state),
  guestFavouritesNav: (state, action) => GuestFavouritesNavigator.router.getStateForAction(action,state),
  //Landlord Navigators
  landlordTabBar: (state,action) => LandlordTabBarNavigator.router.getStateForAction(action,state),
  landlordHomeNav: (state,action) => LandlordHomeNavigator.router.getStateForAction(action,state),


  user,
  section,
  webrtc,
  chat,
  properties,
  propertyScreen
}, devToolsEnhancer());

export default AppReducer;

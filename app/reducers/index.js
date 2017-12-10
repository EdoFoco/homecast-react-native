import { combineReducers } from 'redux';
import { GuestTabBarNavigator } from '../navigators/guest-section/GuestTabBarNavigator';
import { GuestPropertiesNavigator } from '../components/templates/guest-section/properties-tab/Navigator';
import { GuestFavouritesNavigator } from '../components/templates/guest-section/favourites-tab/Navigator';
import { GuestViewingsNavigator } from '../components/templates/guest-section/viewings-tab/Navigator';
import { OptionsNavigator } from '../components/templates/shared/options-tab/Navigator';

import { LandlordTabBarNavigator } from '../navigators/landlord-section/LandlordTabBarNavigator';
import { LandlordPropertiesNavigator } from '../components/templates/landlord-section/properties-tab/Navigator';

import { guestViewingsNav  } from './NavReducer';
import { guestTabBar }from './NavReducer';
import { guestPropertiesNav }from './NavReducer';


import user from './User';
import section from './Section';
import webrtc from './NewWebRTC';
import chat from './Chat';
import properties from './Properties';
import propertyScreen from './PropertyScreen';
import viewings from './Viewings';
import scrapers from './Scrapers';

import devToolsEnhancer from 'remote-redux-devtools';

const AppReducer = combineReducers({
  //Guest Navigators
  guestTabBar,
  guestPropertiesNav,
  guestFavouritesNav: (state, action) => GuestFavouritesNavigator.router.getStateForAction(action,state),
  guestViewingsNav,
  optionsNav: (state, action) => OptionsNavigator.router.getStateForAction(action,state),
  
  //Landlord Navigators
  landlordTabBar: (state,action) => LandlordTabBarNavigator.router.getStateForAction(action,state),
  landlordPropertiesNav: (state,action) => LandlordPropertiesNavigator.router.getStateForAction(action,state),
  
  user,
  section,
  webrtc,
  chat,
  properties,
  propertyScreen,
  viewings,
  scrapers
}, devToolsEnhancer());

export default AppReducer;

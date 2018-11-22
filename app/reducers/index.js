import * as types from '../actions/Types';
import { combineReducers } from 'redux';
import { OptionsNavigator } from '../components/templates/shared/options-tab/Navigator';

import { guestViewingsNav  } from './NavReducer';
import { guestTabBar }from './NavReducer';
import { guestRootNav }from './NavReducer';

import { guestPropertiesNav }from './NavReducer';
import { favouritesNav }from './NavReducer';
import { chatsNav }from './NavReducer';

import { landlordRootNav } from './NavReducer';
import { landlordTabBar }from './NavReducer';
import { landlordPropertiesNav }from './NavReducer';
import { landlordViewingsNav} from './NavReducer';
import { genericNav } from './NavReducer';
import user from './User';
import section from './Section';
import chat from './Chat';
import properties from './Properties';
import viewings from './Viewings';
import scrapers from './Scrapers';
import network from './Network';
import location from './Location';
import filters from './Filters';

import devToolsEnhancer from 'remote-redux-devtools';

const AppReducer = combineReducers({

  //Guest Navigators
  guestTabBar,
  guestRootNav,
  guestPropertiesNav,
  guestFavouritesNav: favouritesNav,
  guestViewingsNav,
  guestChatsNav: chatsNav,
  optionsNav: (state, action) => OptionsNavigator.router.getStateForAction(action,state),
  genericNav,

  //Landlord Navigators
  landlordRootNav,
  landlordTabBar: landlordTabBar,
  landlordPropertiesNav,
  landlordViewingsNav, 

  user,
  section,
  chat,
  properties,
  viewings,
  scrapers,
  network,
  location,
  filters
  
}, devToolsEnhancer());


const rootReducer = (state, action) => {
  if (action.type === types.RESET_REDUCERS) {
    state = undefined
  }
  return AppReducer(state, action)
}

export default rootReducer;

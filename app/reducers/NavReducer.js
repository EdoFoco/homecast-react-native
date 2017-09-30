import { GuestHomeNavigator } from '../navigators/guest-section/HomeNavigator';
import { GuestTabBarNavigator } from '../navigators/guest-section/GuestTabBarNavigator';
import { GuestViewingsNavigator } from '../navigators/guest-section/ViewingsNavigator';

import { NavigationActions } from 'react-navigation';
import * as types from '../actions/Types';

export default function guestTabBar(state,action) {
  if (action.type === 'JUMP_TO_TAB') {
    return { ...state, index:0 }
  } else {
    console.log('GuestTabBar');
    console.log(state);
    return GuestTabBarNavigator.router.getStateForAction(action, state);
  }
}

export function guestHomeNav(state,action) {
    console.log('GuestHomeNav');
    console.log(state);
    return GuestHomeNavigator.router.getStateForAction(action, state);
}

export function guestViewingsNav(state,action) {
    console.log('GuestViewingsNav');
    console.log(state);
    return GuestViewingsNavigator.router.getStateForAction(action, state);
}
/*export function guestHomeNav(state, action) {
  let nextState;
  switch (action.type) {
    case types.GOTO_SCREEN:
      nextState = GuestHomeNavigator.router.getStateForAction(NavigationActions.navigate({routeName: action.routeName}))
      break;
   
    default:
      nextState = GuestHomeNavigator.router.getStateForAction(action, state);
      break;
  }

  return nextState || state;
}*/


import { GuestHomeNavigator } from '../navigators/GuestSection/HomeNavigator';
import { GuestTabBarNavigator } from '../navigators/GuestTabBarNavigator';

import { NavigationActions } from 'react-navigation';
import * as types from '../actions/Types';

export default function guestTabBar(state,action) {
  if (action.type === 'JUMP_TO_TAB') {
    return { ...state, index:0 }
  } else {
    return GuestTabBarNavigator.router.getStateForAction(action,state)
  }
}
/*
export default function guestHomeNav(state, action) {
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
}
*/
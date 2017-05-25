import { GuestHomeNavigator } from '../navigators/guest-section/HomeNavigator';
import { GuestTabBarNavigator } from '../navigators/GuestTabBarNavigator';

import { NavigationActions } from 'react-navigation';
import * as types from '../actions/Types';

export default function guestTabBar(state,action) {
  if (action.type === 'JUMP_TO_TAB') {
    return { ...state, index:0 }
  } else {
    /*let resetTabAction = NavigationActions.navigate({
              routeName: action.routeName,
              action: NavigationActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Home' })],
              }),
            });*/

    return GuestTabBarNavigator.router.getStateForAction(action, state);
    //return GuestTabBarNavigator.router.getStateForAction(action,state)
    
  }
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


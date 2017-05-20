import { AppNavigator } from '../navigators/AppNavigator';
import { GuestTabBarNavigator } from '../navigators/GuestTabBarNavigator';
import { NavigationActions } from 'react-navigation';
import * as types from '../actions/Types';


// Start with two routes: The Main screen, with the Login screen on top.
const firstAction = AppNavigator.router.getActionForPathAndParams('Main');
//const guestTabBarAction = AppNavigator.router.getActionForPathAndParams('Profile');
//const guestTabBarAction =AppNavigator.router.getStateForAction(firstAction);

//const tempNavState = AppNavigator.router.getStateForAction(firstAction);
//const secondAction = AppNavigator.router.getActionForPathAndParams('Login');
const initialNavState = AppNavigator.router.getStateForAction(firstAction);

export default function nav(state = initialNavState, action) {
  let nextState;
  switch (action.type) {
    case 'Login':
      console.log('Nav Login');
      nextState = AppNavigator.router.getStateForAction(NavigationActions.back(), state);
      break;
    case 'Logout':
      nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({ routeName: 'Login' }), state);
      break;
    case types.GOTO_SCREEN:
      //nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({ routeName: action.screenName }));
      nextState = AppNavigator.router.getStateForAction(_goToGuestTabBar(action.screenName))
      break;
    case types.GOTO_GUEST_TAB_BAR:
      nextState = AppNavigator.router.getStateForAction(_goToGuestTabBar());
      break;
    default:
      nextState = AppNavigator.router.getStateForAction(action, state);
      break;
  }

  return nextState || state;
}

var _goToGuestTabBar = function(){
  const actionToDispatch = NavigationActions.reset({
    index: 0,
    key: null,
    router: GuestTabBarNavigator,
    actions: [NavigationActions.navigate({ routeName: 'Guest' })],
  });
  return actionToDispatch;
}

var _navigateInGuestTabBar = function(screenName){
  const actionToDispatch = NavigationActions.reset({
    index: 0,
    key: null,
    actions: [NavigationActions.navigate({ routeName: screeName })],
  });
  return actionToDispatch;
}

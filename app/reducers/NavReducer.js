import { GuestTabBarNavigator } from '../navigators/guest-section/GuestTabBarNavigator';
import { GuestViewingsNavigator } from '../components/templates/guest-section/viewings-tab/Navigator';
import { GuestPropertiesNavigator } from '../components/templates/guest-section/properties-tab/Navigator';
import { NavigationActions } from 'react-navigation';
import * as types from '../actions/Types';

const initalGuestTabNavigatorState = GuestTabBarNavigator.router.getStateForAction(GuestTabBarNavigator.router.getActionForPathAndParams('Properties'));
const initialViewingsNavigatorState = GuestViewingsNavigator.router.getStateForAction(GuestViewingsNavigator.router.getActionForPathAndParams('ViewingsHome'));
const initalGuestPropertiesState =  GuestPropertiesNavigator.router.getStateForAction(GuestPropertiesNavigator.router.getActionForPathAndParams('PropertiesHome'));

export const guestTabBar = (state = initalGuestTabNavigatorState, action) => {
  const nextState = GuestTabBarNavigator.router.getStateForAction(action, state);

  switch(action.type){
    case types.GO_TO_GUEST_PROPERTIES_TAB:
      return GuestTabBarNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Properties'}),
      );
    default:
      return nextState || state;
  }
};

export const guestPropertiesNav = (state = initalGuestPropertiesState, action) => {
  const nextState = GuestPropertiesNavigator.router.getStateForAction(action, state);

  switch(action.type){
    case types.PROPERTIES_TAB_GO_TO_PROPERTY:
      return GuestPropertiesNavigator.router.getStateForAction(
        NavigationActions.reset({
          index: 1,
          actions: [
            NavigationActions.navigate({ routeName: 'PropertiesHome'}),
            NavigationActions.navigate({ routeName: 'PropertyScreen', params: {property: action.property}})
          ]
        }));

      case types.GO_TO_PROPERTIES_TAB_VIEWING:
        return GuestPropertiesNavigator.router.getStateForAction(
          NavigationActions.reset({
            index: 1,
            actions: [
              NavigationActions.navigate({ routeName: 'PropertiesHome'}),
              NavigationActions.navigate({ routeName: 'PropertiesTabViewing', params: {property: action.property, viewingId: action.viewingId}})
            ]
          }));
        // return GuestPropertiesNavigator.router.getStateForAction(
        //   NavigationActions.navigate(
        //     {
        //       routeName: 'ViewingScreen',
        //       params: { viewing: action.viewing }
        //     }
        // ));

      case types.PROPERTIES_TAB_GO_BACK:
        return GuestPropertiesNavigator.router.getStateForAction(
          NavigationActions.back({key: null}));
        
    default:
      return nextState || state;
  }
};


export const guestViewingsNav = (state = initialViewingsNavigatorState, action) => {
  const nextState = GuestViewingsNavigator.router.getStateForAction(action, state);

  switch(action.type){
    case 'Navigation/RESET_VIEWING_TAB':
      return initialViewingsNavigatorState;
    default:
      return nextState || state;
  }
};


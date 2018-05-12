import { GuestTabBarNavigator } from '../navigators/guest-section/GuestTabBarNavigator';
import { GuestViewingsNavigator } from '../components/templates/guest-section/viewings-tab/Navigator';
import { GuestPropertiesNavigator } from '../components/templates/guest-section/properties-tab/Navigator';
import { GuestChatsNavigator } from '../components/templates/guest-section/chats-tab/Navigator';
import { GuestFavouritesNavigator } from '../components/templates/guest-section/favourites-tab/Navigator'; 
import { LandlordTabBarNavigator } from '../navigators/landlord-section/LandlordTabBarNavigator';
import { LandlordPropertiesNavigator } from '../components/templates/landlord-section/properties-tab/Navigator';
import { NavigationActions } from 'react-navigation';
import * as types from '../actions/Types';

const initalGuestTabNavigatorState = GuestTabBarNavigator.router.getStateForAction(GuestTabBarNavigator.router.getActionForPathAndParams('PropertiesTab'));
const initialLandlordTabNavigatorState = LandlordTabBarNavigator.router.getStateForAction(LandlordTabBarNavigator.router.getActionForPathAndParams('PropertiesTab'));
const initialViewingsNavigatorState = GuestViewingsNavigator.router.getStateForAction(GuestViewingsNavigator.router.getActionForPathAndParams('ViewingsHome'));
const initalGuestPropertiesState =  GuestPropertiesNavigator.router.getStateForAction(GuestPropertiesNavigator.router.getActionForPathAndParams('PropertiesHome'));
const initialChatsState =  GuestChatsNavigator.router.getStateForAction(GuestChatsNavigator.router.getActionForPathAndParams('ChatsHome'));
const initialFavouritesState =  GuestFavouritesNavigator.router.getStateForAction(GuestFavouritesNavigator.router.getActionForPathAndParams('FavouritesHome'));
const intitialLandlordPropertiesState = LandlordPropertiesNavigator.router.getStateForAction(LandlordPropertiesNavigator.router.getActionForPathAndParams('PropertiesHome'));

export const guestTabBar = (state = initalGuestTabNavigatorState, action) => {
  const nextState = GuestTabBarNavigator.router.getStateForAction(action, state);

  switch(action.type){
    case types.GO_TO_GUEST_PROPERTIES_TAB:
      return GuestTabBarNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'PropertiesTab'}),
      );
    case types.GO_TO_CHATS_TAB:
      return GuestTabBarNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'ChatsTab'}),
      );
    case types.GOTO_SECTION:
      return initalGuestTabNavigatorState
    default:
      return nextState || state;
  }
};

export const landlordTabBar = (state = initialLandlordTabNavigatorState, action) => {
  const nextState = LandlordTabBarNavigator.router.getStateForAction(action, state);

  switch(action.type){
    case types.GOTO_SECTION:
      return initialLandlordTabNavigatorState
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
              NavigationActions.navigate({ routeName: 'PropertiesViewing', params: {property: action.property, viewingId: action.viewingId}})
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
    
      case 'Navigation/NAVIGATE':
          console.log(action.routeName);
          if(action.routeName.toLowerCase().indexOf('tab') > -1){
            return initalGuestPropertiesState;
          }
    default:
      return nextState || state;
  }
};


export const guestViewingsNav = (state = initialViewingsNavigatorState, action) => {
  const nextState = GuestViewingsNavigator.router.getStateForAction(action, state);

  switch(action.type){
    case 'Navigation/RESET_VIEWING_TAB':
      return initialViewingsNavigatorState;
    case 'Navigation/NAVIGATE':
        if(action.routeName.toLowerCase().indexOf('tab') > -1){
          return initialViewingsNavigatorState;
        }
    default:
      return nextState || state;
  }
};

export const chatsNav = (state = initialChatsState, action) => {
  const nextState = GuestChatsNavigator.router.getStateForAction(action, state);

  switch(action.type){
      case types.GO_TO_CHAT:
        return GuestChatsNavigator.router.getStateForAction(
          NavigationActions.reset({
            index: 1,
            actions: [
              NavigationActions.navigate({ routeName: 'ChatsHome'}),
              NavigationActions.navigate({ routeName: 'Chat', params: {chat: action.chat}})
            ]
          }));
      case 'Navigation/NAVIGATE':
        if(action.routeName.toLowerCase().indexOf('tab') > -1){
          return initialChatsState;
        }
    default:
      return nextState || state;
  }
};

export const favouritesNav = (state = initialFavouritesState, action) => {
  const nextState = GuestFavouritesNavigator.router.getStateForAction(action, state);

  switch(action.type){
        case 'Navigation/NAVIGATE':
          if(action.routeName.toLowerCase().indexOf('tab') > -1){
            return initialFavouritesState;
          }
        default:
          return nextState || state;
    }
};

export const landlordPropertiesNav = (state = intitialLandlordPropertiesState, action) => {
  const nextState = LandlordPropertiesNavigator.router.getStateForAction(action, state);

  switch(action.type){
        case 'Navigation/NAVIGATE':
          if(action.routeName.toLowerCase().indexOf('tab') > -1){
            return intitialLandlordPropertiesState;
          }
        default:
          return nextState || state;
    }
};

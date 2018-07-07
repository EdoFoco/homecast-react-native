import { GuestTabBarNavigator } from '../navigators/guest-section/GuestTabBarNavigator';
import { GuestRootNavigator } from '../navigators/guest-section/GuestRootNavigator';

import { LandlordRootNavigator } from '../navigators/landlord-section/LandlordRootNavigator';

import { GuestViewingsNavigator } from '../components/templates/guest-section/viewings-tab/Navigator';
import { GuestPropertiesNavigator } from '../components/templates/guest-section/properties-tab/Navigator';
import { GuestChatsNavigator } from '../components/templates/guest-section/chats-tab/Navigator';
import { GuestFavouritesNavigator } from '../components/templates/guest-section/favourites-tab/Navigator'; 
import { LandlordTabBarNavigator } from '../navigators/landlord-section/LandlordTabBarNavigator';
import { LandlordPropertiesNavigator } from '../components/templates/landlord-section/properties-tab/Navigator';
import { NavigationActions } from 'react-navigation';
import * as types from '../actions/Types';
import GAClient from '../libs/third-party/GoogleAnalytics/ga';

const initalGuestTabNavigatorState = GuestTabBarNavigator.router.getStateForAction(GuestTabBarNavigator.router.getActionForPathAndParams('PropertiesTab'));
const initialGuestRootNavigatorState = GuestRootNavigator.router.getStateForAction(GuestRootNavigator.router.getActionForPathAndParams('TabBar'));
const initialLandlordTabNavigatorState = LandlordTabBarNavigator.router.getStateForAction(LandlordTabBarNavigator.router.getActionForPathAndParams('PropertiesTab'));
const initialViewingsNavigatorState = GuestViewingsNavigator.router.getStateForAction(GuestViewingsNavigator.router.getActionForPathAndParams('ViewingScreen'));
const initalGuestPropertiesState =  GuestPropertiesNavigator.router.getStateForAction(GuestPropertiesNavigator.router.getActionForPathAndParams('PropertiesPropertyScreen'));
const initialChatsState =  GuestChatsNavigator.router.getStateForAction(GuestChatsNavigator.router.getActionForPathAndParams('Chat'));
const initialFavouritesState =  GuestFavouritesNavigator.router.getStateForAction(GuestFavouritesNavigator.router.getActionForPathAndParams('PropertyScreen'));
const intitialLandlordPropertiesState = LandlordPropertiesNavigator.router.getStateForAction(LandlordPropertiesNavigator.router.getActionForPathAndParams('EditPropertyScreen'));
const initialLandlordRootNavigatorState = LandlordRootNavigator.router.getStateForAction(LandlordRootNavigator.router.getActionForPathAndParams('TabBar'));

export const guestTabBar = (state = initalGuestTabNavigatorState, action) => {
  const nextState = GuestTabBarNavigator.router.getStateForAction(action, state);

  switch(action.type){
    case types.GO_TO_GUEST_PROPERTIES_TAB:
      return GuestTabBarNavigator.router.getStateForAction(
        NavigationActions.navigate({ key: null, routeName: 'PropertiesTab'}),
      );
    case types.GO_TO_CHATS_TAB:
      return GuestTabBarNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'ChatsStack'}),
      );
    case types.GOTO_SECTION:
      return initalGuestTabNavigatorState
    default:
      return nextState || state;
  }
};

export const guestRootNav = (state = initialGuestRootNavigatorState, action) => {
  const nextState = GuestRootNavigator.router.getStateForAction(action, state);

  switch(action.type){
    case types.RETURN_TO_GUEST_TAB_BAR:
      return GuestRootNavigator.router.getStateForAction(
        NavigationActions.back()
      );
    case types.GOTO_SECTION:
      return initialGuestRootNavigatorState;
    default:
      return nextState || state;
  }
};


export const landlordRootNav = (state = initialLandlordRootNavigatorState, action) => {
  const nextState = LandlordRootNavigator.router.getStateForAction(action, state);

  switch(action.type){
    case types.GOTO_SECTION:
      return initialLandlordRootNavigatorState;
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
        NavigationActions.navigate({ routeName: 'PropertiesPropertyScreen', params: {property: action.property}})
      );
      
    case types.GO_TO_PROPERTIES_HOME:
        // return GuestPropertiesNavigator.router.getStateForAction(
        //   NavigationActions.navigate({
        //     key: null,
        //     routeName: 'PropertiesHome' 
        //   })
        // );

    case types.GO_TO_PROPERTIES_TAB_VIEWING:
      return GuestPropertiesNavigator.router.getStateForAction(
        NavigationActions.reset({
          key: null,
          index: 1,
          actions: [
            NavigationActions.navigate({ routeName: 'PropertiesHome' }),
            NavigationActions.navigate({ routeName: 'PropertiesViewing', params: {property: action.property, viewingId: action.viewingId} }),
          ],
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
            //return initalGuestPropertiesState;
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
    case types.VIEWINGS_TAB_GO_TO_VIEWING:
      return GuestViewingsNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'ViewingScreen', params: {viewingId: action.viewingId, property: action.property}})
      );
    default:
      return nextState || state;
  }
};

export const chatsNav = (state = initialChatsState, action) => {
  const nextState = GuestChatsNavigator.router.getStateForAction(action, state);

  switch(action.type){
      case types.GO_TO_CHATS_HOME:
        return GuestChatsNavigator.router.getStateForAction(
            NavigationActions.navigate({ routeName: 'Chat', params: {chat: action.chat}})
        );
      case types.GO_TO_CHAT:
        return GuestChatsNavigator.router.getStateForAction(
              NavigationActions.navigate({ routeName: 'Chat', params: {chat: action.chat}})
          );
      case 'Navigation/NAVIGATE':
        if(action.routeName.toLowerCase().indexOf('tab') > -1){
          //return initialChatsState;
        }
    default:
      return nextState || state;
  }
};

export const favouritesNav = (state = initialFavouritesState, action) => {
  const nextState = GuestFavouritesNavigator.router.getStateForAction(action, state);

  switch(action.type){
        case types.FAVOURITES_TAB_GO_TO_PROPERTY:
          return GuestFavouritesNavigator.router.getStateForAction(
            NavigationActions.navigate({ routeName: 'PropertyScreen', params: {property: action.property}})
          );
        default:
          return nextState || state;
    }
};

export const landlordPropertiesNav = (state = intitialLandlordPropertiesState, action) => {
  const nextState = LandlordPropertiesNavigator.router.getStateForAction(action, state);

  switch(action.type){
        case types.PROPERTIES_TAB_GO_TO_PROPERTY:
          return LandlordPropertiesNavigator.router.getStateForAction(
            NavigationActions.navigate({ routeName: 'EditPropertyScreen', params: {property: action.property}})
          );
        default:
          return nextState || state;
    }
};

export const genericNav = (state = null, action) => {
  switch(action.type){
        case 'Navigation/NAVIGATE':
          if(action.routeName){
            GAClient.gaClientInstance.trackScreen(action.routeName);
          }
        default:
          return state;
    }
};

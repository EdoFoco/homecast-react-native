import * as types from './Types';

export function goToScreen(routeName){
    return {
        type: types.GOTO_SCREEN,
        routeName: routeName
    }
}

export function goToGuestTabBar(){
   // return dispatch(NavigationActions.navigate({ routeName: 'Home' });

    return {
        type: types.GOTO_GUEST_TAB_BAR
    }

}
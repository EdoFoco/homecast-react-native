import * as types from './Types';
import { AsyncStorage } from 'react-native';

export function goToScreen(screeName){
    return {
        type: types.GOTO_SCREEN,
        screenName: screeName
    }
}

export function goToGuestTabBar(){
    return {
        type: types.GOTO_GUEST_TAB_BAR
    }

}
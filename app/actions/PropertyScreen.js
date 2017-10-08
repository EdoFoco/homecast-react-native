import * as types from './Types';


export function updatePropertyActiveTab(tab){
    return {
        type: types.UPDATE_PROPERTY_ACTIVE_TAB,
        tab: tab
    }
}

import * as types from './Types';

export function goToPropertiesTab(){
    return {
        type: types.GO_TO_GUEST_PROPERTIES_TAB
    }
}

export function resetViewingsTab(property){
    return {
        type: 'Navigation/RESET_VIEWINGS_TAB'
    }
}

export function goToPropertiesTabViewingsScreen(property, viewingId){
    return {
        type: types.GO_TO_PROPERTIES_TAB_VIEWING,
        property: property,
        viewingId: viewingId
    }
}

export function propertiesTabGoBack(fromScreen){
    return {
        type: types.PROPERTIES_TAB_GO_BACK,
        fromScreen: fromScreen
    }
}
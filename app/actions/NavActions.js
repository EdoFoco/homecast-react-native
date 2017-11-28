import * as types from './Types';

export function goToPropertyScreen(property){
    return {
        type: types.PROPERTIES_TAB_GO_TO_PROPERTY,
        property: property
    }
}

export function resetViewingsTab(property){
    return {
        type: 'Navigation/RESET_VIEWINGS_TAB'
    }
}

export function goToPropertiesTabViewingsScreen(viewing){
    return {
        type: types.GO_TO_PROPERTIES_TAB_VIEWING,
        viewing: viewing
    }
}

export function propertiesTabGoBack(fromScreen){
    return {
        type: types.PROPERTIES_TAB_GO_BACK,
        fromScreen: fromScreen
    }
}
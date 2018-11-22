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

export function goToPropertiesHome(){
    return {
        type: types.GO_TO_PROPERTIES_HOME
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

export function goToChatsHome(){
    return {
        type: types.GO_TO_CHATS_HOME
    }
}

export function goToChatsTab(){
    return {
        type: types.GO_TO_CHATS_TAB,
    }
}

export function goToChat(chat){
    return {
        type: types.GO_TO_CHAT,
        chat: chat
    }
}

export function returnToGuestTabBar(){
    return {
        type: types.RETURN_TO_GUEST_TAB_BAR
    }
}


//New
export function goToGuestPropertyScreen(property){
    return {
        type: types.PROPERTIES_TAB_GO_TO_PROPERTY,
        property: property
    }
}

export function goToLandlordPropertyScreen(property){
    return {
        type: types.PROPERTIES_TAB_GO_TO_PROPERTY,
        property: property
    }
}

export function goToGuestFavouritesPropertyScreen(property){
    return {
        type: types.FAVOURITES_TAB_GO_TO_PROPERTY,
        property: property
    }
}

export function goToGuestViewingsScreen(viewingId, property){
    return {
        type: types.GUEST_VIEWINGS_TAB_GO_TO_VIEWING,
        viewingId: viewingId,
        property: property
    }
}

export function goToLandlordViewingsScreen(viewingId, property){
    return {
        type: types.LANDLORD_VIEWINGS_TAB_GO_TO_VIEWING,
        viewingId: viewingId,
        property: property
    }
}
import * as types from '../actions/Types';

const initialPropertyScreenState = {
     activeTab: 1
}

export default function propertyScreen(state = initialPropertyScreenState, action) {
 
 switch(action.type){
     case types.UPDATE_PROPERTY_ACTIVE_TAB:
       return { ...state,  activeTab: action.tab };
    default:
        return state;
   }
}
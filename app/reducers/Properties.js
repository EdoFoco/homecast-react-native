import * as types from '../actions/Types';

const initialPropertiesState = {
     propertiesList: [],
     currentProperty: {
         name: "",
         address: "",
         city: "",
         postcode: ""
     },
     currentPropertyViewings: []
}

export default function properties(state = initialPropertiesState, action) {
 
 switch(action.type){
     case types.UPDATE_PROPERTIES_LIST:
       return { ...state,  propertiesList: action.properties };
     case types.UPDATE_CURRENT_PROPERTY:
        return {...state, currentProperty: action.property}
     case types.UPDATE_CURRENT_PROPERTY_VIEWINGS:
        return {...state, currentPropertyViewings: action.viewings}
    default:
        return state;
   }
}
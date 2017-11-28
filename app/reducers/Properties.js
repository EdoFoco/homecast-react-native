import * as types from '../actions/Types';

const initialPropertiesState = {
     propertiesList: [],
     currentProperty: {
         name: "",
         address: "",
         city: "",
         postcode: "",
         description_sections: [],
         viewings: []
     },
     currentPropertyViewings: [],
     viewingsLoaded: false
}

export default function properties(state = initialPropertiesState, action) {
 
 switch(action.type){
     case types.UPDATE_PROPERTIES_LIST:
       return { ...state,  propertiesList: action.properties };
     case types.UPDATE_CURRENT_PROPERTY:
        return {...state, currentProperty: action.property}
     case types.UPDATE_CURRENT_PROPERTY_VIEWINGS:
        return {...state, currentPropertyViewings: action.viewings}
     case types.UPDATE_VIEWINGS_LOADED:
        return {...state, viewingsLoaded: action.loaded}
     case types.UPDATE_VIEWING: {
         let viewings = [...state.currentPropertyViewings];
         let index = viewings.findIndex( v => v.id === action.viewing.id)
         viewings[index] = action.viewing;
         return {...state, currentPropertyViewings: viewings}
     }
    default:
        return state;
   }
}
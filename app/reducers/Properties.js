import * as types from '../actions/Types';

const initialPropertiesState = {
     propertiesList: [],
}

export default function properties(state = initialPropertiesState, action) {
 
 switch(action.type){
     case types.UPDATE_PROPERTIES_LIST:
       return { ...state,  propertiesList: action.properties };
     case types.UPDATE_CURRENT_PROPERTY:
        let properties = [...state.propertiesList];
        let index = properties.findIndex(p => p.id === action.property.id);
        if(index > -1){
            properties[index] = action.property;
        }
        return {...state, propertiesList: properties}
    case types.UPDATE_VIEWING: {
         let properties = [...state.propertiesList];
         let viewing;
         for (let property of properties) {
            let index = property.viewings.findIndex( v => v.id === action.viewing.id)
            if(index > -1){
                property.viewings[index] = action.viewing;
                break;
            }
         };

         return {...state, propertiesList: properties}
     }
    default:
        return state;
   }
}
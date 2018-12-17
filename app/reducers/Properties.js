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
            let viewings = [...properties[index].viewings];
            properties[index] = action.property;
            properties[index].viewings = viewings;
        }
        return {...state, propertiesList: properties}
    
    case types.UPDATE_VIEWING: {
        let properties = [...state.propertiesList];
        let property = properties.find(p => p.id == action.viewing.property_id);
        if(!property.viewings){
            property.viewings = [];
        }

        let viewing = property.viewings.find( v => v.id == action.viewing.id);
        if(!viewing){
        property.viewings.push(action.viewing);
        }
        else{
        viewing = action.viewing;
        }

        return {...state, propertiesList: properties}
     }

    case types.UPDATE_PROPERTY_VIEWINGS: {
        let properties = [...state.propertiesList];
        let property = properties.find( p => p.id === action.propertyId);
        property.viewings = action.viewings;
        
        return {...state, propertiesList: properties}
    }
    default:
        return state;
   }
}
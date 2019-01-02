import * as types from '../actions/Types';

const initialPropertiesState = {
    current_page: 1,
    last_page: 0,
    listings: []
}

export default function properties(state = initialPropertiesState, action) {
 switch(action.type){
     case types.UPDATE_PROPERTIES_LIST:
        if(action.current_page == 1){
            return { ...state,  listings: action.listings, current_page: action.current_page, last_page: action.last_page };
        }
        let existingListings = [...state.listings];
        action.listings.forEach(listing => {
            let existingIndex = existingListings.find(p => p.id == listing.id);
            if(!existingIndex){
                existingListings.push(listing);
            }
        });
        return { ...state,  listings: existingListings, current_page: action.current_page, last_page: action.last_page };
     case types.UPDATE_CURRENT_PROPERTY:
        let properties = [...state.listings];
        let index = properties.findIndex(p => p.id === action.property.id);
        if(index > -1){
            let viewings = [...properties[index].viewings];
            properties[index] = action.property;
            properties[index].viewings = viewings;
        }
        return {...state, listings: properties}
    
    case types.UPDATE_VIEWING: {
        let properties = [...state.listings];
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

        return {...state, listings: properties}
     }

    case types.UPDATE_PROPERTY_VIEWINGS: {
        let properties = [...state.listings];
        let property = properties.find( p => p.id === action.propertyId);
        property.viewings = action.viewings;
        
        return {...state, listings: properties}
    }
    default:
        return state;
   }
}
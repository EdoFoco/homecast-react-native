import * as types from '../actions/Types';

const initialScrapersState = {
     scrapers: []
}

export default function scrapers(state = initialScrapersState, action) {
 
 switch(action.type){
     case types.UPDATE_SCRAPERS:
       return { ...state,  scrapers: action.scrapers };
    default:
        return state;
   }
}
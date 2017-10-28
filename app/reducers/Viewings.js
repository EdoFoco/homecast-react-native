import * as types from '../actions/Types';

const initialViewingsState = {
    viewingReservations: []
}

export default function viewings(state = initialViewingsState, action) {
 
 switch(action.type){
     case types.UPDATE_VIEWING_RESERVATIONS:
       return { ...state,  viewingReservations: action.reservations };
    default:
        return state;
   }
}
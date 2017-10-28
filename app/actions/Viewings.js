import * as types from './Types';
import * as errorHandler from './ErrorHandler';
import ApiService from '../libs/services/ApiService';




export function updateCurrentPropertyViewings(viewings){
    return {
        type: types.UPDATE_CURRENT_PROPERTY_VIEWINGS,
        viewings: viewings
    }
};

export function updateViewingsLoaded(loaded){
    return {
        type: types.UPDATE_VIEWINGS_LOADED,
        loaded: loaded
    }
};

export function updateCurrentViewing(viewing){
    return {
        type: types.UPDATE_VIEWING,
        viewing: viewing
    }
}

export function removeFromFavourites(userId, propertyId){
    return (dispatch, getState) => {
        return ApiService.removeFromFavourites(userId, propertyId);
      }
}

export function getPropertyViewings(propertyId){
    return (dispatch, getState) => {
        return ApiService.getPropertyViewings(propertyId)
            .then(resp => {
                dispatch(updateCurrentPropertyViewings(resp.data.viewings));
                return resp.data.viewings;
            });
      }
}

export function createViewingReservation(userId, viewingId){
    return (dispatch, getState) => {
        return ApiService.createViewingReservation(userId, viewingId);
      }
}

export function cancelViewingReservation(userId, viewingId){
    return (dispatch, getState) => {
        return ApiService.deleteViewingReservation(userId, viewingId);
      }
}

export function getViewing(viewingId){
    return (dispatch, getState) => {
        return ApiService.getViewing(viewingId)
        .then((resp) => {
            dispatch(updateCurrentViewing(resp.data));
            return resp.data;
        })
      }
}
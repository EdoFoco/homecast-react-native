import * as types from './Types';
import * as errorHandler from './ErrorHandler';
import ApiService from '../libs/services/ApiService';

export function updateViewing(viewing){
    return {
        type: types.UPDATE_VIEWING,
        viewing: viewing
    }
}

export function updateViewingReservations(reservations){
    return {
        type: types.UPDATE_VIEWING_RESERVATIONS,
        reservations: reservations
    }
}

export function removeFromFavourites(userId, propertyId){
    return (dispatch, getState) => {
        return ApiService.removeFromFavourites(userId, propertyId);
      }
}

export function createViewingReservation(userId, viewingId){
    return (dispatch, getState) => {
        return ApiService.createViewingReservation(userId, viewingId)
        .then(() => {
            return dispatch(getViewingReservations(userId));
        });
      }
}

export function cancelViewingReservation(userId, viewingId){
    return (dispatch, getState) => {
        return ApiService.deleteViewingReservation(userId, viewingId)
        .then(() => {
            return dispatch(getViewingReservations(userId));
        });
      }
}

export function getViewing(viewingId){
    return (dispatch, getState) => {
        return ApiService.getViewing(viewingId)
        .then((resp) => {
            dispatch(updateViewing(resp.data));
            return resp.data;
        })
      }
}

export function getViewingReservations(userId){
    return (dispatch, getState) => {
        return ApiService.getViewingReservations(userId)
        .then((resp) => {
            dispatch(updateViewingReservations(resp.data.viewing_reservations));
            return resp.data;
        })
      }
}
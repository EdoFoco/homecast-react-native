import * as types from './Types';
import * as ErrorHandler from './ErrorHandler';
import ApiServiceFactory from '../libs/services/ApiServiceFactory';

export function updatePropertyViewings(propertyId, viewings){
    return {
        type: types.UPDATE_PROPERTY_VIEWINGS,
        viewings: viewings,
        propertyId: propertyId
    }
}

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
    return async (dispatch, getState) => {
        try{
            var apiService = await ApiServiceFactory.getInstance();
            await apiService.removeFromFavourites(userId, propertyId);
        }
        catch(error){
            handleError(error, dispatch);
        }
      }
}

export function deleteViewing(propertyId){
    return async (dispatch, getState) => {
        try{
            var apiService = await ApiServiceFactory.getInstance();
            await apiService.deleteViewing(propertyId);
        }
        catch(error){
            handleError(error, dispatch);
        }
      }
}

export function createViewingReservation(userId, viewingId){
    return async (dispatch, getState) => {
        try{
            var apiService = await ApiServiceFactory.getInstance();
            await apiService.createViewingReservation(userId, viewingId)
            return dispatch(getViewingReservations(userId));
        }
        catch(error){
            handleError(error, dispatch);
        }
      }
}

export function cancelViewingReservation(userId, viewingId){
    return async (dispatch, getState) => {
        try{
            var apiService = await ApiServiceFactory.getInstance();
            await apiService.deleteViewingReservation(userId, viewingId);
            dispatch(getViewingReservations(userId));
        } 
        catch(error){
            handleError(error, dispatch);
        }
      }
}

export function getPropertyViewings(propertyId){
    return async (dispatch, getState) => {
        try{
            var apiService = await ApiServiceFactory.getInstance();
            var resp = await apiService.getPropertyViewings(propertyId)
            dispatch(updatePropertyViewings(propertyId, resp.data.viewings));
            return resp.data.viewings;
        }
        catch(error){
            handleError(error, dispatch);
        }
      }
}

export function getViewing(viewingId){
    return async (dispatch, getState) => {
        try{
            var apiService = await ApiServiceFactory.getInstance();
            var resp = await apiService.getViewing(viewingId)
            dispatch(updateViewing(resp.data));
            return resp.data;
        }
        catch(error){
            handleError(error, dispatch);
        }
      }
}

export function getViewingReservations(userId){
    return async (dispatch, getState) => {
        try{
            var apiService = await ApiServiceFactory.getInstance();
            var resp = await apiService.getViewingReservations(userId);
            dispatch(updateViewingReservations(resp.data.viewing_reservations));
            return resp.data;
        }
        catch(error){
            handleError(error, dispatch);
        }
      }
}

export function sendViewingInvitationEmail(viewingId, email){
    return async (dispatch, getState) => {
        try{
            var apiService = await ApiServiceFactory.getInstance();
            var resp = await apiService.sendViewingInvitationEmail(viewingId, email);
            return resp.data;
        }
        catch(error){
            handleError(error, dispatch);
        }
      }
}

function handleError(error, dispatch){
    console.log(error);
    var action = ErrorHandler.getActionForError(error);
    if(action){
        dispatch(action);
    }
    throw error;
}
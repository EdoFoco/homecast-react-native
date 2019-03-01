import * as types from './Types';
import * as ErrorHandler from './ErrorHandler';
import ApiServiceFactory from '../libs/services/ApiServiceFactory';

export function createProperty(placeId, userId){
    return async (dispatch, getState) => {
        try{
            var apiService = await ApiServiceFactory.getInstance();
            await apiService.createProperty(placeId);
            dispatch(getUserProperties(userId))
        }
        catch(error){
            handleError(error, dispatch);
        }
    }
}

export function deleteProperty(propertyId, userId){
    return async (dispatch, getState) => {
        try{
            var apiService = await ApiServiceFactory.getInstance();
            await apiService.deleteProperty(propertyId);
            dispatch(getUserProperties(userId))
        }
        catch(error){
            handleError(error, dispatch);
        }
    }
}

export function updatePropertiesList(listings, currentPage, lastPage){
    return {
        type: types.UPDATE_PROPERTIES_LIST,
        listings: listings,
        current_page: currentPage,
        last_page: lastPage
    }
}

export function updateCurrentProperty(property){
    return {
        type: types.UPDATE_CURRENT_PROPERTY,
        property: property
    }
};

export function addToFavourites(userId, propertyId){
    return async (dispatch, getState) => {
        try{
            var apiService = await ApiServiceFactory.getInstance();
            return await apiService.addToFavourites(userId, propertyId);
        }
        catch(error){
            handleError(error, dispatch);
        }
    }
}

export function removeFromFavourites(userId, propertyId){
    return async (dispatch, getState) => {
        try{
            var apiService = await ApiServiceFactory.getInstance();
            return await apiService.removeFromFavourites(userId, propertyId);
        }
        catch(error){
            handleError(error, dispatch);
        }
      }
}

export function getProperties(filters, page) {
    return async (dispatch, getState) => {
        try{
            var apiService = await ApiServiceFactory.getInstance();
            var resp = await apiService.getProperties(filters, page);
            dispatch(updatePropertiesList(resp.data.data, resp.data.current_page, resp.data.last_page));
            return resp.data;
        }
        catch(error){
            handleError(error, dispatch);
        }
    }
  }

export function getUserProperties(userId) {
    return async (dispatch, getState) => {
        try{
            var apiService = await ApiServiceFactory.getInstance();
            var resp = await apiService.getUserProperties(userId);
            dispatch(updatePropertiesList(resp.data.properties));
            return resp.data.properties;
        }
        catch(error){
            handleError(error, dispatch);
        }
    }
  }

export function getProperty(propertyId){
    return async (dispatch, getState) => {
        try{
            var apiService = await ApiServiceFactory.getInstance();
            var resp = await apiService.getProperty(propertyId);
            dispatch(updateCurrentProperty(resp.data));
            return resp.data;
        }
        catch(error){
            handleError(error, dispatch);
        }   
      }
  }

  export function updateProperty(property, userId){
    return async (dispatch, getState) => {
        try{
            var apiService = await ApiServiceFactory.getInstance();
            var resp = await apiService.updateProperty(property);
            dispatch(getUserProperties(userId));
            return resp.data;
        }
        catch(error){
            handleError(error, dispatch);
        }
      }
  }

  export function uploadPropertyImage(userId, propertyId, image, progressCallback){
    return async (dispatch, getState) => {
        try{
            var apiService = await ApiServiceFactory.getInstance();
            var resp = await apiService.uploadPropertyImage(propertyId, image, progressCallback);
            dispatch(getUserProperties(userId));
            return resp.data;
        }
        catch(error){
            handleError(error, dispatch);
        }
      }
  }

  export function deletePropertyImages(userId, propertyId, imageIds){
    return async (dispatch, getState) => {
        try{
            var apiService = await ApiServiceFactory.getInstance();
            await apiService.deletePropertyImages(propertyId, imageIds);
            return dispatch(getUserProperties(userId));
        }
        catch(error){
            handleError(error, dispatch);
        }
      }
  }

export function createViewing(propertyId, userId, viewingInfo){
    return async (dispatch, getState) => {
        try{
            var apiService = await ApiServiceFactory.getInstance();
            await apiService.createViewing(propertyId, viewingInfo);
            dispatch(getUserProperties(userId))
        }
        catch(error){
            handleError(error, dispatch);
        }
    }
}

export function importProperty(propertyId, userId, url){
    return async (dispatch, getState) => {
        try{
            var apiService = await ApiServiceFactory.getInstance();
            var resp = await apiService.importProperty(propertyId, url)
            dispatch(getUserProperties(userId));
            return resp.data;
        }
        catch(error){
            handleError(error, dispatch);
        }
      }
  }

  export function activateProperty(userId, propertyId, isActive){
    return async (dispatch, getState) => {
        try{
            var apiService = await ApiServiceFactory.getInstance();
            var resp = await apiService.activateProperty(propertyId, isActive)
            dispatch(getUserProperties(userId));
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
import * as types from './Types';
import * as ErrorHandler from './ErrorHandler';
import ApiServiceFactory from '../libs/services/ApiServiceFactory';

export function updatePropertiesList(properties){
    return {
        type: types.UPDATE_PROPERTIES_LIST,
        properties: properties
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

export function getProperties(filters) {
    return async (dispatch, getState) => {
        try{
            var apiService = await ApiServiceFactory.getInstance();
            var resp = await apiService.getProperties(filters);
            dispatch(updatePropertiesList(resp.data.properties));
            return resp.data.properties;
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

            var deleteImageTasks = imageIds.map(id => apiService.deletePropertyImage(propertyId, id));
            await Promise.all(deleteImageTasks);
            
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

  function handleError(error, dispatch){
    console.warn(error);
    var action = ErrorHandler.getActionForError(error);
    if(action){
        return dispatch(action);
    }
    throw error;
}
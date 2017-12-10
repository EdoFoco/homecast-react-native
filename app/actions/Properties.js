import * as types from './Types';
import * as errorHandler from './ErrorHandler';
import ApiService from '../libs/services/ApiService';


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
    return (dispatch, getState) => {
        return ApiService.addToFavourites(userId, propertyId);
      }
}

export function removeFromFavourites(userId, propertyId){
    return (dispatch, getState) => {
        return ApiService.removeFromFavourites(userId, propertyId);
      }
}

export function getProperties() {
    return (dispatch, getState) => {
      
      return ApiService.getProperties()
          .then(resp => {
              dispatch(updatePropertiesList(resp.data.properties));
          });
    }
  }

export function getUserProperties(userId) {
    return (dispatch, getState) => {
      return ApiService.getUserProperties(userId)
          .then(resp => {
              dispatch(updatePropertiesList(resp.data.properties));
          });
    }
  }

export function getProperty(propertyId){
    return (dispatch, getState) => {
        return ApiService.getProperty(propertyId)
            .then(resp => {
                dispatch(updateCurrentProperty(resp.data));
                return resp.data;
            });
      }
  }

  export function updateProperty(property, userId){
    return (dispatch, getState) => {
        return ApiService.updateProperty(property)
            .then(resp => {
                dispatch(getUserProperties(userId));
                return resp.data;
            });
      }
  }

  export function importProperty(propertyId, userId, url){
    return (dispatch, getState) => {
        return ApiService.importProperty(propertyId, url)
            .then(resp => {
                dispatch(getUserProperties(userId));
                return resp.data;
            });
      }
  }
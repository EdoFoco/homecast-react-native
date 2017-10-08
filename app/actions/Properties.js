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

export function getPropertyViewings(propertyId){
    return (dispatch, getState) => {
        return ApiService.getPropertyViewings(propertyId)
            .then(resp => {
                dispatch(updateCurrentPropertyViewings(resp.data.viewings));
                return resp.data.viewings;
            }).catch((error) => {
                if(error.response.status == 401){
                    dispatch(errorHandler.handleUnauthorized());
                 }
                 else{
                     console.error('Auth Error - handle error');
                 }
            });
      }
}

export function getProperties() {
    return (dispatch, getState) => {
      
      return ApiService.getProperties()
          .then(resp => {
              dispatch(updatePropertiesList(resp.data.properties));
          }).catch((error) => {
            if(error.response.status == 401){
                dispatch(errorHandler.handleUnauthorized());
             }
             else{
                dispatch(errorHandler.handleUnauthorized());
                
                 console.error('Auth Error - handle error');
             }
          });
    }
  }
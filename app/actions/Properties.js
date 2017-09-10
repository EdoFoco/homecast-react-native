import * as types from './Types';
import TntApi from '../libs/services/TntApi';

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

export function updateCurrentPropertyVieiwngs(viewings){
    return {
        type: types.UPDATE_CURRENT_PROPERTY_VIEWINGS,
        viewings: viewings
    }
};

export function errorFetchingProperties(error){
    console.log(error);
    //Todo: Do something
}

export function getPropertyViewings(propertyId){
    return (dispatch, getState) => {
        
        return TntApi.get('properties/' + propertyId + '/viewings')
            .then(resp => {
                console.log(resp);
                dispatch(updateCurrentPropertyVieiwngs(resp.viewings));
            }).catch( (ex) => {
                dispatch(errorFetchingProperties(ex));
            });
      }
}

export function getProperties() {
    return (dispatch, getState) => {
      
      return TntApi.get('properties')
          .then(resp => {
              console.log(resp);
              dispatch(updatePropertiesList(resp.properties));
          }).catch( (ex) => {
              dispatch(errorFetchingProperties(ex));
          });
    }
  }
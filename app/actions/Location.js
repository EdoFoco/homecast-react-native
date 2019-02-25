import * as types from './Types';
import * as ErrorHandler from './ErrorHandler';
import ApiServiceFactory from '../libs/services/ApiServiceFactory';

export function updateLocationSuggestions(suggestions){
    return {
        type: types.UPDATE_LOCATION_SUGGESTIONS,
        suggestions: suggestions
    }
}

export function getAddressSuggestions(text, type){
    return async (dispatch, getState) => {
        try{
            var apiService = await ApiServiceFactory.getInstance();
            var resp = await apiService.getAddressSuggestions(text, type)
            dispatch(updateLocationSuggestions(resp.data.suggestions));
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
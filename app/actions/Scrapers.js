import * as types from './Types';
import ApiServiceFactory from '../libs/services/ApiServiceFactory';
import * as ErrorHandler from './ErrorHandler';


export function updateScrapers(scrapers){
    return {
        type: types.UPDATE_SCRAPERS,
        scrapers: scrapers
    }
}

export function getScrapers() {
    return async (dispatch, getState) => {
      try{
        var apiService = await ApiServiceFactory.getInstance();
        var resp = await apiService.getScrapers();
        dispatch(updateScrapers(resp.data.scrapers));
        return resp.data.scrapers;
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
        dispatch(action);
    }
    throw error;
}